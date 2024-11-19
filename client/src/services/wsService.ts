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

	private async handleMessage(event: MessageEvent) {
		const data = JSON.parse(event.data);
		switch (data.type) {
			case 'error':
				this.showError(data.msg);
				break;
			case 'invite':
				this.showMessage(`${data.from} invited you to a game`);
				break;
			case 'invite-accepted':
				this.showMessage(`${data.from} accepted your invite`);
				break;
			case 'msg':
				this.showMessage(data.msg);
				break;
			case 'dice_roll':
				useGameStore().setDice(data.result, data.available);
				break;
			case 'move_piece':
				await useGameStore().setMatch(data.match);
				break;
      case 'in_game_msg':
				this.showInGameMessage(data.msg, data.user);
				break;
			default:
				console.warn('Unknown event:', data.type);
		}
	}

	private showError(message: string) {
		useWsStore().addError(message);
	}

	private showMessage(msg: string) {
		useWsStore().addNotification(msg);
	}

	private showInGameMessage(msg: string, user: string) {
		useWsStore().addMessage(msg, user);
	}
}

export const wsService = new WebSocketService();
