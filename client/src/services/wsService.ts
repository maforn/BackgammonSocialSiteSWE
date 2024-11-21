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
			case 'start_dice_roll':
				useGameStore().setStartDice(data.result.roll1, data.result.count1, data.result.roll2, data.result.count2);
				useGameStore().setStarter(data.starter, data.turn);
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
			case 'match_over':
				this.showMessage(data.winner + " won the match!")
				this.showMessage(data.winner + "'s rating: " + data.old_winner_rating + " -> " + data.new_winner_rating)
				this.showMessage(data.loser + "'s rating: " + data.old_loser_rating + " -> " + data.new_loser_rating);
				break;
			case 'round_over':
				this.showMessage(data.winner + " won the round!")
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
