import axiosInstance from '@/axios';
import axios from 'axios';
import { useWsStore } from '@/stores/wsStore';

export const createTournament = async (name: string, open: boolean, participants: string[], rounds_to_win: number, type: string) => {
	try {
		const response = await axiosInstance.post('/tournaments', {
			name, open, participants, rounds_to_win, type
		});
		return response.data.tournament;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			useWsStore().addError(error.response.data.detail);
		} else {
			console.error('Error creating tournament:', error);
		}
		return null;
	}
};

export const checkCreatedTournamentExists = async () => {
	const response = await axiosInstance.get('/tournaments/exists');
	return response.data;
}

export const fetchActiveTournament = async () => {
	try {
		const response = await axiosInstance.get('/tournaments');
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			useWsStore().addError(error.response.data.detail);
		} else {
			console.error('Error fetching tournament:', error);
		}
		return null;
	}
}