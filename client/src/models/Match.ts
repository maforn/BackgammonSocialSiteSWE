import { BoardConfiguration } from './BoardConfiguration';

export class Match {
	player1: string;
	player2: string;
	boardConfiguration: BoardConfiguration;
	dice: {
		roll: number[];
		available: number[];
	};
	turn: number;
	created_at: Date;
	updated_at: Date;
	status: string;
	rounds_to_win: number;
	winsP1: number;
	winsP2: number;

	constructor(
		player1: string,
		player2: string,
		boardConfiguration: BoardConfiguration,
		dice: { roll: number[]; available: number[] },
		turn: number,
		created_at: Date,
		updated_at: Date,
		status: string,
		rounds_to_win: number,
	) {
		this.player1 = player1;
		this.player2 = player2;
		this.boardConfiguration = boardConfiguration ?? new BoardConfiguration();
		this.dice = dice;
		this.turn = turn;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.status = status;
		this.rounds_to_win = rounds_to_win;
		this.winsP1 = 0;
		this.winsP2 = 0;
	}
}
