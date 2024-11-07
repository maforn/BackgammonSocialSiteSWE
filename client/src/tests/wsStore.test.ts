import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useWsStore } from '@/stores/wsStore';
import { useAuthStore } from '@/stores/authStore';
import { wsService } from '@/services/wsService';

vi.mock('@/stores/authStore');
vi.mock('@/services/wsService');

describe('wsStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('connects to WebSocket if token exists', () => {
		const wsStore = useWsStore();
		(useAuthStore as any).mockReturnValue({ token: 'test-token' });
		wsService.connect = vi.fn();
		wsService.socket = new WebSocket('ws://localhost:8000/ws');

		wsStore.connect();

		expect(wsService.connect).toHaveBeenCalled();
		expect(wsStore.socket).toBe(wsService.socket);
	});

	it('disconnects from WebSocket', () => {
		const wsStore = useWsStore();
		wsService.disconnect = vi.fn();

		wsStore.disconnect();

		expect(wsService.disconnect).toHaveBeenCalled();
		expect(wsStore.socket).toBeNull();
	});

	it('sends a message via WebSocket', () => {
		const wsStore = useWsStore();
		wsService.sendMessage = vi.fn();

		wsStore.sendMessage('type', 'message');

		expect(wsService.sendMessage).toHaveBeenCalledWith('type', 'message');
	});

	it('adds an error to the state', () => {
		const wsStore = useWsStore();
		const message = 'Test error message';

		wsStore.addError(message);

		expect(wsStore.errors.length).toBe(1);
		expect(wsStore.errors[0].message).toBe(message);
	});

	it('removes an error from the state', () => {
		const wsStore = useWsStore();
		const message = 'Test error message';
		wsStore.addError(message);
		const errorId = wsStore.errors[0].id;

		wsStore.removeError(errorId);

		expect(wsStore.errors.length).toBe(0);
	});
});
