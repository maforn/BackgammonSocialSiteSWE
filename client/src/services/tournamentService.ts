import axiosInstance from '@/axios';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
import { useWsStore } from '@/stores/wsStore';

export const createTournament = async (name: string, open: boolean, participants: string[]) => {
	try {
		await axiosInstance.post('/tournaments', {
			name, open, participants
		});
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			useWsStore().addError(error.response.data.detail);
		} else {
			console.error('Error creating tournament:', error);
		}
	}
};