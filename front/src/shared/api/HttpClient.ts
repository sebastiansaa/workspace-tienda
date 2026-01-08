import type { AxiosResponse } from "axios";

export interface HttpClient {
  get<T = unknown>(url: string, config?: object): Promise<AxiosResponse<T>>;
  post<T = unknown>(url: string, data?: unknown, config?: object): Promise<AxiosResponse<T>>;
  patch<T = unknown>(url: string, data?: unknown, config?: object): Promise<AxiosResponse<T>>;
  put<T = unknown>(url: string, data?: unknown, config?: object): Promise<AxiosResponse<T>>;
  delete<T = unknown>(url: string, config?: object): Promise<AxiosResponse<T>>;
}
