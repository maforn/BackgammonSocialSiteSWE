import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000' // Replace with your API base URL
})

// Add a request interceptor
axiosInstance.interceptors.request.use(function(config) {
  config.headers.Authorization = `Bearer ${useAuthStore().token}`

  return config
})

export default axiosInstance
