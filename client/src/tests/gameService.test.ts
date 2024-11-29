import { describe, it, expect } from 'vitest';
import { BoardConfiguration, PointConfiguration } from '@/models/BoardConfiguration';
import { swapPlayers, moveOnBoard, findUsedDie, checkMoveValidity, getAllowedPointIndices, doRandomMove, getPiecesSummary, isBackgammon, isGammon, NUMBER_OF_PLAYER_PIECES } from '@/services/gameService';

describe('swapPlayers', () => {
    it('should invert the order of points', () => {
        const board: BoardConfiguration = {
            points: [
            new PointConfiguration(2, 0),
            new PointConfiguration(0, 3),
            new PointConfiguration(1, 1),
            ],
            bar: new PointConfiguration(1, 2)
        };

        const newBoard = swapPlayers(board);

        expect(newBoard.points[0].player1).toBe(1);
        expect(newBoard.points[0].player2).toBe(1);
        expect(newBoard.points[1].player1).toBe(3);
        expect(newBoard.points[1].player2).toBe(0);
        expect(newBoard.points[2].player1).toBe(0);
        expect(newBoard.points[2].player2).toBe(2);
    });

    it('should swap pieces in the bar', () => {
        const board: BoardConfiguration = {
            points: [
            new PointConfiguration(2, 0),
            new PointConfiguration(0, 3),
            new PointConfiguration(1, 1),
            ],
            bar: new PointConfiguration(1, 2)
        };

        const newBoard = swapPlayers(board);

        expect(newBoard.bar.player1).toBe(2);
        expect(newBoard.bar.player2).toBe(1);
    });
});

describe('moveOnBoard', () => {
	it('should move a piece from the bar to a point', () => {
		const board: BoardConfiguration = new BoardConfiguration();
        board.bar = new PointConfiguration(1, 0);
        board.points[23] = new PointConfiguration(0, 0);

		const dice = [1];
		moveOnBoard(board, dice, 24, 23);

		expect(board.bar.player1).toBe(0);
		expect(board.points[23].player1).toBe(1);
	});

	it('should move a piece from one point to another', () => {
		const board: BoardConfiguration = new BoardConfiguration();
        board.points[23] = new PointConfiguration(2, 0);
        board.points[20] = new PointConfiguration(0, 0);

		const dice = [3];
		moveOnBoard(board, dice, 23, 20);

		expect(board.points[23].player1).toBe(1);
        expect(board.points[20].player1).toBe(1);
	});

	it('should hit the opponent\'s piece if there is only one', () => {
		const board: BoardConfiguration = new BoardConfiguration();
        board.points[23] = new PointConfiguration(2, 0);
        board.points[20] = new PointConfiguration(0, 1);

		const dice = [3];
		moveOnBoard(board, dice, 23, 20);

		expect(board.points[23].player1).toBe(1);
        expect(board.points[20].player1).toBe(1);
        expect(board.points[20].player2).toBe(0);
        expect(board.bar.player2).toBe(1);
    });
});

describe('findUsedDie', () => {
	it('should return the correct die used for the move', () => {
		const dice = [1, 2, 3, 4, 5];
		const srcPointIndex = 10;
		const dstPointIndex = 7;

		const usedDie = findUsedDie(dice, srcPointIndex, dstPointIndex);

		expect(usedDie).toBe(3);
	});

	it('should return null if no die can be used for the move', () => {
		const dice = [1, 2, 3, 4, 5];
		const srcPointIndex = 10;
		const dstPointIndex = 4;

		const usedDie = findUsedDie(dice, srcPointIndex, dstPointIndex);

		expect(usedDie).toBeNull();
	});

	it('should return null if dice array is empty', () => {
		const dice: number[] = [];
		const srcPointIndex = 10;
		const dstPointIndex = 9;

		const usedDie = findUsedDie(dice, srcPointIndex, dstPointIndex);

		expect(usedDie).toBeNull();
	});
});

describe('checkMoveValidity', () => {
    it('throws an error when indices are out of range', () => {
        const board: BoardConfiguration = new BoardConfiguration();
        const dice = [1];

        expect(() => checkMoveValidity(board, dice, 25, 22)).toThrow('Indices are out of range');
        expect(() => checkMoveValidity(board, dice, 23, 24)).toThrow('Indices are out of range');
        expect(() => checkMoveValidity(board, dice, -1, 22)).toThrow('Indices are out of range');
        expect(() => checkMoveValidity(board, dice, 23, -2)).toThrow('Indices are out of range');
	});

	it('throws an error when pieces should be moved out of the bar first', () => {
		const board: BoardConfiguration = new BoardConfiguration();
        board.bar = new PointConfiguration(1, 0);
        const dice = [1];

        expect(() => checkMoveValidity(board, dice, 23, 22)).toThrow('You should move pieces out of the bar first!');
	});

	it('throws an error when moving to higher points', () => {
        const board: BoardConfiguration = new BoardConfiguration();
        const dice = [1];

        expect(() => checkMoveValidity(board, dice, 22, 23)).toThrow('You cannot move to higher points!');
	});

	it('throws an error when there are no pieces to move', () => {
        const board: BoardConfiguration = new BoardConfiguration();
        board.points[23] = new PointConfiguration(0, 0);
        const dice = [1];

        expect(() => checkMoveValidity(board, dice, 24, 22)).toThrow('You have no pieces to move!');
        expect(() => checkMoveValidity(board, dice, 23, 22)).toThrow('You have no pieces to move!');
	});

	it('throws an error when the destination point is not allowed', () => {
        const board: BoardConfiguration = new BoardConfiguration();
        board.points[23] = new PointConfiguration(1, 0);
        board.points[22] = new PointConfiguration(0, 0);
        const dice = [2];

        expect(() => checkMoveValidity(board, dice, 23, 22)).toThrow('The destination point is not allowed');
	});
});

describe('getAllowedPointIndices', () => {
	it('should return an empty array if no dice are available', () => {
		const board: BoardConfiguration = new BoardConfiguration();
		const result = getAllowedPointIndices(board, null);
		expect(result).toEqual([]);
	});

	it('should return points where pieces can be moved from the bar', () => {
		const board: BoardConfiguration = new BoardConfiguration();
		board.bar = new PointConfiguration(1, 0);
		board.points[23] = new PointConfiguration(0, 0);
		const dice = [1];
		const result = getAllowedPointIndices(board, dice);
		expect(result).toEqual([23]);
	});

	it('should return points with pieces if no point is selected', () => {
		const board: BoardConfiguration = new BoardConfiguration();

		for (let i = 0; i < 24; i++) {
			board.points[i] = new PointConfiguration(0, 0);
		}

		board.points[23] = new PointConfiguration(1, 0);
		const dice = [1];
		const result = getAllowedPointIndices(board, dice);
		expect(result).toEqual([23]);
	});

	it('should return reachable points from the selected point', () => {
		const board: BoardConfiguration = new BoardConfiguration();
		board.points[23] = new PointConfiguration(1, 0);
		board.points[22] = new PointConfiguration(0, 0);
		const dice = [1];
		const result = getAllowedPointIndices(board, dice, 23);
		expect(result).toEqual([22]);
	});

	it('should allow moving pieces to the bear-off area if all pieces are in base', () => {
		const board: BoardConfiguration = new BoardConfiguration();
		for (let i = 0; i < 24; i++) {
			if(i < 6)
				board.points[i] = new PointConfiguration(3, 0);
			else
				board.points[i] = new PointConfiguration(0, 0);
		}
		const dice = [1];
		const result = getAllowedPointIndices(board, dice, 0);
		expect(result).toEqual([-1]);
	});

	it('should not allow moving to points with more than one opponent piece', () => {
		const board: BoardConfiguration = new BoardConfiguration();
		board.points[23] = new PointConfiguration(1, 0);
		board.points[22] = new PointConfiguration(0, 2);
		const dice = [1];
		const result = getAllowedPointIndices(board, dice, 23);
		expect(result).toEqual([]);
	});
});

describe('doRandomMove', () => {
	it('should move a piece from the bar to a point', () => {
		const board: BoardConfiguration = new BoardConfiguration();
		board.bar = new PointConfiguration(1, 0);
		board.points[23] = new PointConfiguration(0, 0);

		const dice = [1];
		const result = doRandomMove(board, dice);

		expect(result).toEqual({ src: 24, dst: 23 });
		expect(board.bar.player1).toBe(0);
		expect(board.points[23].player1).toBe(1);
	});

	it('should find a move if there is an available one', () => {
		const board: BoardConfiguration = new BoardConfiguration();

		for (let i = 0; i < 24; i++) {
			board.points[i] = new PointConfiguration(0, 0);
		}

		board.points[23] = new PointConfiguration(2, 0);
		board.points[20] = new PointConfiguration(0, 0);

		const dice = [3];
		const result = doRandomMove(board, dice);

		expect(result).toEqual({ src: 23, dst: 20 });
	});

	it('should return null if no valid moves are available', () => {
		const board: BoardConfiguration = new BoardConfiguration();
		
		for (let i = 0; i < 24; i++) {
			board.points[i] = new PointConfiguration(0, 0);
		}

		const dice = [3];
		const result = doRandomMove(board, dice);

		expect(result).toBeNull();
	});
});

describe("getPiecesSummary", () => {
    it("should correctly calculate the pieces for base configuration", () => {
        const baseBoard: BoardConfiguration = new BoardConfiguration();

        const [onBoard1, onBar1, onOpp1] = getPiecesSummary(baseBoard, true);
        const [onBoard2, onBar2, onOpp2] = getPiecesSummary(baseBoard, false);

        expect(onBoard1).toBe(NUMBER_OF_PLAYER_PIECES);
        expect(onBoard1).toBe(onBoard2);
        expect(onBar1).toBe(0);
        expect(onBar1).toBe(onBar2);
        expect(onOpp1).toBe(2);
        expect(onOpp1).toBe(onOpp2);
    });

	it("should correctly calculate the pieces for custom configuration", () => {
        const baseBoard = new BoardConfiguration();

		baseBoard.bar.player1 = 4;
        baseBoard.points[22].player1 = 5;
        baseBoard.points[2].player2 = 5; 

        const [onBoard1, onBar1, onOpp1] = getPiecesSummary(baseBoard, true);
        const [onBoard2, onBar2, onOpp2] = getPiecesSummary(baseBoard, false);

        expect(onBoard1).toBe(20); 
        expect(onBoard2).toBe(20); 
        expect(onBar1).toBe(4);   
        expect(onBar2).toBe(0);   
        expect(onOpp1).toBe(7);    
        expect(onOpp2).toBe(7);  
    });
});

describe("isGammon", () => {
    it("should correctly determine if a gammon condition is met", () => {
        const board = new BoardConfiguration();
        // Test 1: Default board, no gammon
        expect(isGammon(board, true)).toBe(false);
        expect(isGammon(board, false)).toBe(false);

        // Test 2: All points cleared, no gammon
        board.points = board.points.map(() => ({ player1: 0, player2: 0 }));
        expect(isGammon(board, true)).toBe(false);
        expect(isGammon(board, false)).toBe(false);

        // Test 3: Player 2 has all pieces in one point
        board.points[7] = { player1: 0, player2: 15 };
        expect(isGammon(board, true)).toBe(true);
        expect(isGammon(board, false)).toBe(false);

        // Test 4: Player 1 has all pieces in one point
        board.points[7] = { player1: 15, player2: 0 };
        expect(isGammon(board, true)).toBe(false);
        expect(isGammon(board, false)).toBe(true);
    });
});

describe("isBackgammon", () => {
    it("should correctly determine if a backgammon condition is met", () => {
        const board = new BoardConfiguration();

        // Test 1: Default board, no backgammon
        expect(isBackgammon(board, true)).toBe(false);
        expect(isBackgammon(board, false)).toBe(false);

        // Test 2: All points cleared, no backgammon
        board.points = board.points.map(() => ({ player1: 0, player2: 0 }));
        expect(isBackgammon(board, true)).toBe(false);
        expect(isBackgammon(board, false)).toBe(false);

        // Test 3: Player 2 has all pieces in one point, no backgammon
        board.points[7] = { player1: 0, player2: 15 };
        expect(isBackgammon(board, true)).toBe(false);
        expect(isBackgammon(board, false)).toBe(false);

        // Test 4: Player 1 has all pieces in one point, no backgammon
        board.points[7] = { player1: 15, player2: 0 };
        expect(isBackgammon(board, true)).toBe(false);
        expect(isBackgammon(board, false)).toBe(false);

        // Test 5: Player 2 has pieces in Player 1's home and bar, backgammon for Player 1
        board.points[7] = { player1: 0, player2: 8 };
        board.points[0] = { player1: 0, player2: 7 };
        expect(isBackgammon(board, true)).toBe(true);
        expect(isBackgammon(board, false)).toBe(false);

        // Test 6: Player 2's pieces moved to the bar, still backgammon for Player 1
        board.points[0] = { player1: 0, player2: 0 };
        board.bar = { player1: 0, player2: 7 };
        expect(isBackgammon(board, true)).toBe(true);
        expect(isBackgammon(board, false)).toBe(false);

        // Test 7: Player 1 has pieces in Player 2's home, backgammon for Player 2
        board.points[7] = { player1: 8, player2: 0 };
        board.points[0] = { player1: 0, player2: 0 };
        board.points[23] = { player1: 7, player2: 0 };
        board.bar = { player1: 0, player2: 0 };
        expect(isBackgammon(board, true)).toBe(false);
        expect(isBackgammon(board, false)).toBe(true);

        // Test 8: Player 1's pieces moved to the bar, still backgammon for Player 2
        board.points[23] = { player1: 0, player2: 0 };
        board.bar = { player1: 7, player2: 0 };
        expect(isBackgammon(board, true)).toBe(false);
        expect(isBackgammon(board, false)).toBe(true);
    });
});