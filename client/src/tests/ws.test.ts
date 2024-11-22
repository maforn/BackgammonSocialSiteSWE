import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '@/stores/authStore';
import { useGameStore } from '@/stores/gameStore';
import { wsService } from '@/services/wsService';

vi.mock('@/stores/authStore');
vi.mock('@/services/authService');
vi.mock('@/stores/gameStore');
vi.mock('@/stores/wsStore');

describe('WebSocketService', () => {
	beforeEach(() => {
		wsService.socket = null;
	});

	describe('connect', () => {
		it('should connect when authStore.token is present', () => {
			const mockToken = 'mockToken';
			const mockWebSocket = {
				onmessage: vi.fn(),
				onerror: vi.fn(),
			};
			(global as any).WebSocket = vi.fn(() => mockWebSocket);

			(useAuthStore as any).mockReturnValue({ token: mockToken });

			wsService.connect();

			expect(wsService.socket).toBe(mockWebSocket);
			expect(mockWebSocket.onmessage).toBeInstanceOf(Function);
			expect(mockWebSocket.onerror).toBeInstanceOf(Function);
			expect(WebSocket).toHaveBeenCalledWith(`${import.meta.env.VITE_WS_URL}/ws?token=${mockToken}`);
		});

		it('should not connect if authStore.token is not present', () => {
			(useAuthStore as any).mockReturnValue({ token: null });

			wsService.connect();

			expect(wsService.socket).toBe(null);
		});
	});

	describe('disconnect', () => {
		it('should close the socket and set it to null', () => {
			const mockSocket = {
				close: vi.fn(),
			};
			wsService.socket = mockSocket as any;

			wsService.disconnect();

			expect(mockSocket.close).toHaveBeenCalled();
			expect(wsService.socket).toBeNull();
		});

		it('should do nothing if socket is already null', () => {
			wsService.socket = null;

			wsService.disconnect();

			expect(wsService.socket).toBeNull();
		});
	});

	describe('sendMessage', () => {
		let mockSocket: any;

		beforeEach(() => {
			mockSocket = {
				send: vi.fn(),
			};
			wsService.socket = null;
		});

		it('should call connect if socket is null', () => {
			const connectSpy = vi.spyOn(wsService, 'connect').mockImplementation(() => {
				wsService.socket = mockSocket;
			});

			wsService.sendMessage('testType', 'testMessage');

			expect(connectSpy).toHaveBeenCalled();
			expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify({ type: 'testType', message: 'testMessage' }));
		});

		it('should send a message if socket is not null', () => {
			wsService.socket = mockSocket;

			wsService.sendMessage('testType', 'testMessage');

			expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify({ type: 'testType', message: 'testMessage' }));
		});

		it('should not send a message if socket is null and connect fails', () => {
			const connectSpy = vi.spyOn(wsService, 'connect').mockImplementation(() => {
				wsService.socket = null;
			});

			wsService.sendMessage('testType', 'testMessage');

			expect(connectSpy).toHaveBeenCalled();
			expect(mockSocket.send).not.toHaveBeenCalled();
		});
	});

	describe('handleMessage', () => {
		it('should handle error message', () => {
			const showErrorSpy = vi.spyOn(wsService as any, 'showError').mockImplementation(() => {});
			const event = { data: JSON.stringify({ type: 'error', msg: 'Error message' }) };

			(wsService as any).handleMessage(event as MessageEvent);

			expect(showErrorSpy).toHaveBeenCalledWith('Error message');
		});

		it('should handle invite message', () => {
			const showInviteSpy = vi.spyOn(wsService as any, 'showMessage').mockImplementation(() => {});
			const event = { data: JSON.stringify({ type: 'invite' }) };

			(wsService as any).handleMessage(event as MessageEvent);

			expect(showInviteSpy).toHaveBeenCalled();
		});

		it('should handle msg message', () => {
			const showMessageSpy = vi.spyOn(wsService as any, 'showMessage').mockImplementation(() => {});
			const event = { data: JSON.stringify({ type: 'msg', msg: 'Test message' }) };

			(wsService as any).handleMessage(event as MessageEvent);

			expect(showMessageSpy).toHaveBeenCalledWith('Test message');
		});

		it('should handle dice_roll message', () => {
			const setDice = vi.fn();
			(useGameStore as any).mockReturnValue({ setDice });

			const event = { data: JSON.stringify({ type: 'dice_roll', result: [1, 2], available: [3, 4] }) };
			wsService['handleMessage'](event as MessageEvent);

			expect(setDice).toHaveBeenCalledWith([1, 2], [3, 4]);
		});

		it('should handle move_piece message', () => {
			const setMatch = vi.fn();
			(useGameStore as any).mockReturnValue({ setMatch });

			const event = { data: JSON.stringify({ type: 'move_piece', match: 'match data' }) };
			wsService['handleMessage'](event as MessageEvent);

			expect(setMatch).toHaveBeenCalledWith('match data');
		});

		it('should handle unknown message type', () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const event = { data: JSON.stringify({ type: 'unknown_type' }) };

			(wsService as any).handleMessage(event as MessageEvent);

			expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown event:', 'unknown_type');
		});

		it('should handle unknown message type', () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const event = { data: JSON.stringify({ type: 'unknown_type' }) };

			(wsService as any).handleMessage(event as MessageEvent);

			expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown event:', 'unknown_type');
		});
	});
});
