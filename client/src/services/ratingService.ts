import axiosInstance from '@/axios';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
import { useWsStore } from '@/stores/wsStore';

export const getTop5AndMe = async () => {
    try {
        const response = await axiosInstance.get('/users/top5_and_me');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            useWsStore().addError(error.response.data.detail);
        } else {
            console.error('Error getting top 5:', error);
        }
    }
};