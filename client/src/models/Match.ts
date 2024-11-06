import { BoardConfiguration } from './BoardConfiguration';

export class Match {
	player1: string;
	player2: string;
	boardConfiguration: BoardConfiguration;
	dice: {
		roll: number[];
		used: number[];
	};
	turn: number;
	created_at: Date;
	updated_at: Date;
	status: string;

	constructor(
		player1: string,
		player2: string,
		boardConfiguration: BoardConfiguration,
		dice: { roll: number[]; used: number[] },
		turn: number,
		created_at: Date,
		updated_at: Date,
		status: string,
	) {
		this.player1 = player1;
		this.player2 = player2;
		this.boardConfiguration = boardConfiguration ?? new BoardConfiguration();
		this.dice = dice;
		this.turn = turn;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.status = status;
	}
}
