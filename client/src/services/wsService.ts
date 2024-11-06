import { useAuthStore } from '@/stores/authStore';
import { logout } from '@/services/authService';
import { useGameStore } from '@/stores/gameStore';
import { useWsStore } from '@/stores/wsStore';

class WebSocketService {
	public socket: WebSocket | null = null;

	connect() {
		const authStore = useAuthStore();
		if (authStore.token) {
			this.socket = new WebSocket(`ws://localhost:8000/ws?token=${authStore.token}`);
			this.socket.onmessage = this.handleMessage.bind(this);
			this.socket.onerror = () => logout();
		}
	}

	disconnect() {
		if (this.socket) {
			this.socket.close();
			this.socket = null;
		}
	}

	sendMessage(type: string, message: string) {
		if (!this.socket) {
			this.connect();
		}
		if (this.socket) {
			this.socket.send(JSON.stringify({ type, message }));
		}
	}

	private handleMessage(event: MessageEvent) {
		const data = JSON.parse(event.data);
		switch (data.type) {
			case 'error':
				this.showError(data.msg);
				break;
			case 'invite':
				this.showInvite();
				break;
			case 'msg':
				this.showMessage(data.msg);
				break;
			case 'dice_roll':
				useGameStore().setDice(data.result[0], data.result[1]);
				break;
			case 'move_piece':
				useGameStore().setMatch(data.match);
				break;
			// Add more cases as needed
			default:
				console.warn('Unknown event:', data.type);
		}
	}

	private showError(message: string) {
		useWsStore().addError(message);
	}

	private showInvite() {
		// TODO: show the invite from x to play: push a store? Maybe add another field
	}

	private showMessage(msg: string) {
		useWsStore().addError(msg);
		// TODO: change this to a toast or something
	}
}

export const wsService = new WebSocketService();
