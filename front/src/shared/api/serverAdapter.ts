import axios, { type AxiosRequestConfig } from 'axios'

// Adapter para llamadas al backend del mismo origen (p.ej. /api/*)
const instance = axios.create({ baseURL: '' })

export const serverAdapter = {
    get: async (url: string, config?: AxiosRequestConfig) => {
        return await instance.get(url, config)
    },
    post: async (url: string, data?: unknown, config?: AxiosRequestConfig) => {
        return await instance.post(url, data, config)
    },
    patch: async (url: string, data?: unknown, config?: AxiosRequestConfig) => {
        return await instance.patch(url, data, config)
    },
    put: async (url: string, data?: unknown, config?: AxiosRequestConfig) => {
        return await instance.put(url, data, config)
    },
    delete: async (url: string, config?: AxiosRequestConfig) => {
        return await instance.delete(url, config)
    },
}
