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
	first_to: number;
	winsP1: number;
	winsP2: number;

	constructor(
		player1: string,
		player2: string,
		boardConfiguration: BoardConfiguration,
		dice: { roll: number[]; used: number[] },
		turn: number,
		created_at: Date,
		updated_at: Date,
		status: string,
		first_to: number
	) {
		this.player1 = player1;
		this.player2 = player2;
		this.boardConfiguration = boardConfiguration ?? new BoardConfiguration();
		this.dice = dice;
		this.turn = turn;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.status = status;
		this.first_to = first_to;
		this.winsP1 = 0;
		this.winsP2 = 0;
	}
}
