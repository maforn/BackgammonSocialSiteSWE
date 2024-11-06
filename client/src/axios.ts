import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:8000', // Replace with your API base URL
});

axiosInstance.interceptors.request.use(function (config) {
	config.headers.Authorization = `Bearer ${useAuthStore().token}`;

	return config;
});

export default axiosInstance;
