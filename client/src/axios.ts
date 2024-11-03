import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/' // Replace with your API base URL
})

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get the token auth store
    const token = useAuthStore().token

    // If the token is available, add it to the headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error: Error) => {
    // Handle the error
    return Promise.reject(error)
  }
)

export default axiosInstance
