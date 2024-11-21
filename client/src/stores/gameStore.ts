// client/src/stores/gameStore.ts
import { defineStore } from 'pinia';
import axiosInstance from '@/axios';
import { BoardConfiguration, PointConfiguration } from '@/models/BoardConfiguration';
import { Match } from '@/models/Match';

interface GameData {
	player1: string;
	player2: string;
	board_configuration: {
		points: PointConfiguration[];
		bar: PointConfiguration;
	};
	dice: number[];
	available: number[];
	turn: number;
	created_at: string;
	updated_at: string;
	status: string;
	first_to: number;
	winsP1: number;
	winsP2: number;
	starter: number;
	startDice: { roll1: number; count1: number; roll2: number; count2: number };
}

export const useGameStore = defineStore('game', {
	state: (): Match => ({
		player1: '',
		player2: '',
		boardConfiguration: new BoardConfiguration(),
		dice: { roll: [], available: [] },
		turn: 0,
		created_at: new Date(),
		updated_at: new Date(),
		status: 'pending',
		first_to: 0,
		winsP1: 0,
		winsP2: 0,
		starter: -1,
		startDice: { roll1: 0, count1: 0, roll2: 0, count2: 0 },
	}),
	actions: {
		fetchGame() {
			return axiosInstance.get('/game').then(response => {
				const data = response.data;
				console.log(data);
				this.setMatch(data);
			});
		},
		checkSuspendedGameExists() {
			return axiosInstance.get('/game/exists').then(response => {
				return response.data;
			});
		},
		setMatch(data: GameData) {
			this.player1 = data.player1;
			this.player2 = data.player2;
			this.boardConfiguration = new BoardConfiguration(
				data.board_configuration.points.map((p: PointConfiguration) => new PointConfiguration(p.player1, p.player2)),
				new PointConfiguration(data.board_configuration.bar.player1, data.board_configuration.bar.player2),
			);
			this.dice.roll = data.dice;
			this.dice.available = data.available;
			this.turn = data.turn;
			this.created_at = new Date(data.created_at);
			this.updated_at = new Date(data.updated_at);
			this.status = data.status;
			this.first_to = data.first_to;
			this.winsP1 = data.winsP1;
			this.winsP2 = data.winsP2;
			this.starter = data.starter;
			this.startDice = data.startDice;

			console.log(this.starter);
		},
		getMatch(): Match {
			return new Match(
				this.player1,
				this.player2,
				this.boardConfiguration,
				this.dice,
				this.turn,
				new Date(this.created_at),
				new Date(this.updated_at),
				this.status,
				this.first_to,
				this.starter,
			);
		},
		setStartDice(roll1: number, count1: number, roll2: number, count2: number) {
			this.startDice = { roll1, count1, roll2, count2 };

		},
		setStarter(starter: number, turn: number) {
			this.starter = starter;
			this.turn = turn;
		},
		setDice(result: number[], available: number[]) {
			this.dice.roll = result;
			this.dice.available = available;
		},
	},
});
