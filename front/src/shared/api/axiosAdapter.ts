//adapter  que usa axios para hacer las peticiones HTTP, NO USA AUTENTICACIÓN. Para endpoints públicos

import axios from 'axios'

import { API_BASE_URL } from '@/shared/api/api'
import { SHARED_CONFIG } from '@/shared/config/shared.config'
import type { HttpClient } from './httpClient'

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: SHARED_CONFIG.api.timeout,
  withCredentials: true,
})

instance.interceptors.response.use(
  (response) => {
    const payload = response.data
    if (
      payload &&
      typeof payload === 'object' &&
      'statusCode' in payload &&
      'message' in payload &&
      'data' in payload
    ) {
      response.data = (payload as { data: unknown }).data ?? null
    }

    return response
  },
  (error) => Promise.reject(error),
)

export const axiosAdapter: HttpClient = {
  get: async (url, config) => {
    return await instance.get(url, config)
  },
  post: async (url, data, config) => {
    return await instance.post(url, data, config)
  },
  patch: async (url, data, config) => {
    return await instance.patch(url, data, config)
  },
  put: async (url, data, config) => {
    return await instance.put(url, data, config)
  },
  delete: async (url, config) => {
    return await instance.delete(url, config)
  },
}

export { instance as axiosInstance }
