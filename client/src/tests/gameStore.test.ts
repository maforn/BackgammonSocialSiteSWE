import { beforeEach, describe, expect, it } from 'vitest';
import axiosInstance from '@/axios';
import MockAdapter from 'axios-mock-adapter';
import { createPinia, setActivePinia } from 'pinia';
import { useGameStore } from '@/stores/gameStore';
import { BoardConfiguration } from '@/models/BoardConfiguration';
import { Match } from '@/models/Match';

// client/src/stores/gameStore.test.ts

describe('game store', () => {
	let mock: MockAdapter;

	beforeEach(() => {
		setActivePinia(createPinia());
		mock = new MockAdapter(axiosInstance);
	});

	it('should set and get match', () => {
		const now = new Date();

		const gameStore = useGameStore();
		const match = new Match(
			'Alice',
			'Bob',
			new BoardConfiguration(),
			{ roll: [1, 2], available: [3, 4] },
			1,
			now,
			now,
			'active',
			1,
		);
		gameStore.setMatch({
			player1: 'Alice',
			player2: 'Bob',
			board_configuration: new BoardConfiguration(),
			dice: [1, 2],
			available: [3, 4],
			turn: 1,
			created_at: now.toISOString(),
			updated_at: now.toISOString(),
			status: 'active',
			first_to: 1,
		});

		expect(gameStore.getMatch()).toEqual(match);
	});

	it('should fetch game data and set match', async () => {
		const mockResponse = {
			player1: 'Alice',
			player2: 'Bob',
			board_configuration: new BoardConfiguration(),
			dice: [1, 2],
			available: [3, 4],
			turn: 1,
			created_at: '2023-01-01T00:00:00Z',
			updated_at: '2023-01-01T00:00:00Z',
			status: 'active',
		};
		mock.onGet('/game').reply(200, mockResponse);

		const gameStore = useGameStore();
		await gameStore.fetchGame();

		expect(gameStore.player1).toBe('Alice');
		expect(gameStore.player2).toBe('Bob');
		expect(gameStore.boardConfiguration).toEqual(new BoardConfiguration());
		expect(gameStore.dice.roll).toEqual([1, 2]);
		expect(gameStore.dice.available).toEqual([3, 4]);
		expect(gameStore.turn).toBe(1);
		expect(gameStore.created_at.toISOString()).toBe('2023-01-01T00:00:00.000Z');
		expect(gameStore.updated_at.toISOString()).toBe('2023-01-01T00:00:00.000Z');
		expect(gameStore.status).toBe('active');
	});

	it('should set match data correctly', () => {
		const gameStore = useGameStore();
		const data = {
			player1: 'Alice',
			player2: 'Bob',
			board_configuration: {
				points: [{ player1: 1, player2: 2 }],
				bar: { player1: 0, player2: 0 },
			},
			dice: [1, 2],
			available: [3, 4],
			turn: 1,
			created_at: '2023-01-01T00:00:00Z',
			updated_at: '2023-01-01T00:00:00Z',
			status: 'active',
			first_to: 1,
		};

		gameStore.setMatch(data);

		expect(gameStore.player1).toBe('Alice');
		expect(gameStore.player2).toBe('Bob');
		expect(gameStore.boardConfiguration.points[0].player1).toBe(1);
		expect(gameStore.boardConfiguration.points[0].player2).toBe(2);
		expect(gameStore.dice.roll).toEqual([1, 2]);
		expect(gameStore.dice.available).toEqual([3, 4]);
		expect(gameStore.turn).toBe(1);
		expect(gameStore.created_at.toISOString()).toBe('2023-01-01T00:00:00.000Z');
		expect(gameStore.updated_at.toISOString()).toBe('2023-01-01T00:00:00.000Z');
		expect(gameStore.status).toBe('active');
	});

	it('should set dice correctly', () => {
		const gameStore = useGameStore();
		gameStore.setDice([3, 4], [5, 6]);
		expect(gameStore.dice.roll).toEqual([3, 4]);
		expect(gameStore.dice.available).toEqual([5, 6]);
	});
});
