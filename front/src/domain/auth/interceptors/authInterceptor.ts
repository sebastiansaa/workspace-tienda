import { axiosInstance } from "@/shared/api/axiosAdapter";
import { useAuthStore } from "../stores/authStore";
import type { InternalAxiosRequestConfig } from "axios";
import { useToast } from "vue-toastification";
// El interceptor se inicializo en el main.ts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (err: unknown) => void;
  config: InternalAxiosRequestConfig
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      resolve(axiosInstance.request(config));
    }
  });
  failedQueue = [];
};

export function setupAuthInterceptors() {
  const authStore = useAuthStore();

  // Request Interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = authStore.accessToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (!originalRequest) return Promise.reject(error);

      // Respuesta de autorización: notificar y no reintentar
      if (error.response?.status === 403) {
        try { useToast().error('No autorizado: se requiere un rol con permisos'); } catch { /* noop */ }
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Intentar refrescar usando el store
          const success = await authStore.refresh();

          if (success && authStore.accessToken) {
            processQueue(null, authStore.accessToken);
            isRefreshing = false;
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;
            }
            return axiosInstance.request(originalRequest);
          } else {
            // Si falla el refresh, logout y rechazar
            processQueue(new Error('Token refresh failed'), null);
            isRefreshing = false;
            authStore.logout();
            return Promise.reject(error);
          }
        } catch (err) {
          processQueue(err, null);
          isRefreshing = false;
          authStore.logout();
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
}
