import { BoardConfiguration } from '@/models/BoardConfiguration';

export const NUMBER_OF_PLAYER_PIECES = 15;

export const swapPlayers = (board: BoardConfiguration): BoardConfiguration => {
	const newBoard = JSON.parse(JSON.stringify(board));

	// Swap pieces on each point
	for (const point of newBoard.points) {
		const tmp = point.player1;
		point.player1 = point.player2;
		point.player2 = tmp;
	}

	// Invert point order
	newBoard.points = newBoard.points.reverse();

	// Swap pieces in the bar
	const tmpBar = newBoard.bar.player1;
	newBoard.bar.player1 = newBoard.bar.player2;
	newBoard.bar.player2 = tmpBar;

	return newBoard;
};

export const moveOnBoard = (
	board: BoardConfiguration,
	dice: number[],
	srcPointIndex: number,
	dstPointIndex: number,
) => {
	checkMoveValidity(board, dice, srcPointIndex, dstPointIndex);

	if (srcPointIndex === 24) {
		board.bar.player1--;
	} else {
		board.points[srcPointIndex].player1--;
	}

	if (dstPointIndex >= 0) {
		board.points[dstPointIndex].player1++;

		// Hit the opponent's piece if there is only one
		if (board.points[dstPointIndex].player2 === 1) {
			board.points[dstPointIndex].player2 = 0;
			board.bar.player2++;
		}
	}
};

export const findUsedDie = (dice: number[], srcPointIndex: number, dstPointIndex: number) => {
	let usedDice = dice.reduce((min, die) => {
		if (srcPointIndex - die <= dstPointIndex && die < min) {
			return die;
		}
		return min;
	}, Infinity);

	if (usedDice === Infinity || usedDice === undefined) {
		return null;
	} else {
		return usedDice;
	}
};

export const checkMoveValidity = (
	board: BoardConfiguration,
	dice: number[],
	srcPointIndex: number,
	dstPointIndex: number,
) => {
	if (srcPointIndex > 24 || srcPointIndex < 0 || dstPointIndex > 23 || dstPointIndex < -1)
		throw new Error('Indices are out of range');
	else if (board.bar.player1 >= 1 && srcPointIndex !== 24)
		throw new Error('You should move pieces out of the bar first!');
	else if (dstPointIndex > srcPointIndex) throw new Error('You cannot move to higher points!');
	else if (
		(srcPointIndex === 24 && board.bar.player1 <= 0) ||
		(srcPointIndex < 24 && board.points[srcPointIndex].player1 <= 0)
	)
		throw new Error('You have no pieces to move!');
	else if (!getAllowedPointIndices(board, dice, srcPointIndex).includes(dstPointIndex)) {
		throw new Error('The destination point is not allowed');
	}
    else if(board.points[dstPointIndex].player2 > 1) {
        throw new Error('The destination point is blocked');
    }
};

export const getAllowedPointIndices = (
	boardConfig: BoardConfiguration,
	availableDice: number[] | null,
	srcPointIndex: number | null = null,
) => {
	if (!availableDice || availableDice.length === 0) {
		// No selection can be done if the dices have not been rolled or it is not you turn
		return [];
	} else if (boardConfig.bar.player1 > 0) {
		// There are pieces in the bar, return the points where the pieces can be moved to
		return availableDice
			.map(dice => 24 - dice)
			.filter(index => index <= 23 && index >= 0 && boardConfig.points[index].player2 <= 1);
	} else if (srcPointIndex === null) {
		// No point has been selected yet, return the points with pieces
		return boardConfig.points.map((point, index) => (point.player1 >= 1 ? index : -1)).filter(index => index !== -1);
	} else {
		// Find the points reachable from the selected point, with at most one opponent's piece

		const allowedIndices = availableDice
			.map(dice => (srcPointIndex ?? 24) - dice)
			.filter(index => index <= 23 && index >= 0 && boardConfig.points[index].player2 <= 1);

		// If the player has all pieces in base, allow moving pieces to the bear-off area
		if (
			boardConfig.points.slice(6, 24).every(point => point.player1 === 0) &&
			availableDice.some(dice => dice > (srcPointIndex ?? 0))
		) {
			allowedIndices.push(-1);
		}

		return allowedIndices;
	}
};

export const doRandomMove = (board: BoardConfiguration, dice: number[]) => {

	const availableSrcs = board.bar.player1 > 0 ? [24] : getAllowedPointIndices(board, dice).sort(() => Math.random() - 0.5);

	for (const src of availableSrcs) {
		const allowedDsts = getAllowedPointIndices(board, dice, src);
		if (allowedDsts.length > 0) {
			const dst = allowedDsts[Math.floor(Math.random() * allowedDsts.length)];
			moveOnBoard(board, dice, src, dst);
			return { src, dst };
		}
	}

	return null;
};

/**
 * Determines if a player committed a gammon.
 * 
 * @param boardConfig The configuration of the game board.
 * @param isPlayer1 Whether to check for gammon by player1 or player2.
 * @returns Whether the player has committed a gammon.
 */
export const isGammon = (boardConfig: BoardConfiguration, isPlayer1: boolean): boolean => {
    const [onBoardPlayer, onBarPlayer] = getPiecesSummary(boardConfig, isPlayer1);
    const [onBoardOpp, onBarOpp] = getPiecesSummary(boardConfig, !isPlayer1);

    return onBoardPlayer + onBarPlayer === 0 && onBoardOpp + onBarOpp === NUMBER_OF_PLAYER_PIECES;
}

/**
 * Determines if a player committed a backgammon.
 * 
 * @param boardConfig The configuration of the game board.
 * @param isPlayer1 Whether to check for backgammon by player1 or player2.
 * @returns Whether the player has committed a backgammon.
 */
export const isBackgammon = (boardConfig: BoardConfiguration, isPlayer1: boolean): boolean => {
    const [onBoardPlayer, onBarPlayer] = getPiecesSummary(boardConfig, isPlayer1);
    const [onBoardOpp, onBarOpp, onOppBaseOpp] = getPiecesSummary(boardConfig, !isPlayer1);

    return (
        onBoardPlayer + onBarPlayer === 0 &&
        onBoardOpp + onBarOpp === NUMBER_OF_PLAYER_PIECES &&
        onBarOpp + onOppBaseOpp > 0
    );
}

/**
 * Returns a summary of the player's pieces distribution on a given board.
 * 
 * @param boardConfig The game board configuration.
 * @param isPlayer1 Whether to count for player1 or player2.
 * @returns A tuple containing:
 *          - The number of pieces on the board.
 *          - The number of pieces on the bar.
 *          - The number of pieces in the opponent's home board.
 */
export const getPiecesSummary = (boardConfig: BoardConfiguration, isPlayer1: boolean): [number, number, number] => {
    if (isPlayer1) {
        const onBoard = boardConfig.points.reduce((sum, point) => sum + point.player1, 0);
        const onBar = boardConfig.bar.player1;
        const onOpponentBase = boardConfig.points.slice(18, 24).reduce((sum, point) => sum + point.player1, 0);

        return [onBoard, onBar, onOpponentBase];
    } else {
        const onBoard = boardConfig.points.reduce((sum, point) => sum + point.player2, 0);
        const onBar = boardConfig.bar.player2;
        const onOpponentBase = boardConfig.points.slice(0, 6).reduce((sum, point) => sum + point.player2, 0);

        return [onBoard, onBar, onOpponentBase];
    }
}