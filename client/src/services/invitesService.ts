import axiosInstance from '@/axios';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
import { useWsStore } from '@/stores/wsStore';

export const sendInviteService = async (opponent_username: string, first_to: number) => {
	try {
		await axiosInstance.post('/invites', {
			opponent_username: opponent_username,
			first_to: first_to,
		});
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			useWsStore().addError(error.response.data.detail);
		} else {
			console.error('Error sending invite:', error);
		}
	}
};

export const receiveInviteService = async () => {
	const authStore = useAuthStore();
	const token = authStore?.token;
	if (token) {
		try {
			const response = await axiosInstance.get('/invites');
			return response.data.pending_invites;
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				useWsStore().addError(error.response.data.detail);
			} else {
				console.error('Error in receiveInviteService:', error);
			}
		}
	}
};

export const acceptInviteService = async (invite_id: string) => {
  try {
    await axiosInstance.post('/invites/accept', { invite_id: invite_id })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      useWsStore().addError(error.response.data.detail)
      throw new Error(error.response.data.detail)
    } else {
      console.error('Error accepting invite:', error)
    }
  }
}
