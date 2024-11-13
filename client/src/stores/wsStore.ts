import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/authStore';
import { wsService } from '@/services/wsService';

interface WsState {
	socket: WebSocket | null;
	errors: { id: number; message: string }[];
	notifications: { id: number; message: string }[];
  messages: { id: number; message: string; user: string }[];
}

export const useWsStore = defineStore('ws', {
	state: (): WsState => ({
		socket: null,
		errors: [],
		notifications: [],
    messages: [],
	}),
	actions: {
		connect() {
			const authStore = useAuthStore();
			if (authStore.token) {
				wsService.connect();
				this.socket = wsService.socket;
			}
		},
		disconnect() {
			wsService.disconnect();
			this.socket = null;
		},
		sendMessage(type: string, message: string) {
			wsService.sendMessage(type, message);
		},
		addError(message: string) {
			const id = Date.now();
			this.errors.push({ id: id, message });
			setTimeout(() => this.removeError(id), 5000);
		},
		addNotification(message: string) {
			const id = Date.now();
			this.notifications.push({ id: id, message });
			setTimeout(() => this.removeNotifications(id), 5000);
		},
    addMessage(message: string, user: string) {
      const id = Date.now();
      this.messages.push({ id: id, message, user });
      setTimeout(() => this.removeMessage(id), 5000);
    },
		removeError(id: number) {
			this.errors = this.errors.filter(error => error.id !== id);
		},
		removeNotifications(id: number) {
			this.notifications = this.notifications.filter(notification => notification.id !== id);
		},
    removeMessage(id: number) {
      this.messages = this.messages.filter(message => message.id !== id);
    }
	},
});
