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
	used: number[];
	turn: number;
	created_at: string;
	updated_at: string;
	status: string;
}

interface GameData {
  player1: string;
  player2: string;
  board_configuration: {
    points: PointConfiguration[];
    bar: PointConfiguration;
  };
  dice: number[];
  used: number[];
  turn: number;
  created_at: string;
  updated_at: string;
  status: string;
}


export const useGameStore = defineStore('game', {
	state: (): Match => ({
		player1: '',
		player2: '',
		boardConfiguration: new BoardConfiguration(),
		dice: { roll: [], used: [] },
		turn: 0,
		created_at: new Date(),
		updated_at: new Date(),
		status: 'pending',
	}),
	actions: {
		fetchGame() {
			return axiosInstance.get('/game').then(response => {
				const data = response.data;
				this.setMatch(data);
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
			this.dice.used = data.used;
			this.turn = data.turn;
			this.created_at = new Date(data.created_at);
			this.updated_at = new Date(data.updated_at);
			this.status = data.status;
		},
		setDice(die1: number, die2: number) {
			this.dice.roll = [die1, die2];
		},
	},
});
