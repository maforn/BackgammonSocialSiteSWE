<template>
	<div class="flex items-center gap-4">
		<div class="board max-w-5xl bg-gray-300" @click.stop="deselectPoint">
			<!-- Left part of the board -->
			<div class="bin">
				<!-- Upper row -->
				<div class="row rotate-180">
					<PointComponent
						v-for="(pointConf, index) in internalConfig.points.slice(12, 18)"
						:key="index"
						:configuration="pointConf"
						:isEven="index % 2 === 0"
						:upperPoint="true"
						:available="allowedPointIndices.includes(index + 12)"
						:selected="srcPointIndex === index + 12"
						@select-point="selectPoint(index + 12)"
					/>
				</div>
				<!-- Lower row -->
				<div class="row">
					<PointComponent
						v-for="(pointConf, index) in internalConfig.points.slice(6, 12)"
						:key="index"
						:configuration="pointConf"
						:isEven="index % 2 === 0"
						:available="allowedPointIndices.includes(index + 6)"
						:selected="srcPointIndex === index + 6"
						@select-point="selectPoint(index + 6)"
					/>
				</div>
			</div>

			<!-- Middel bar -->
			<div id="bar" class="flex flex-col items-center justify-center gap-4">
				<div
					v-if="internalConfig.bar.player1 > 0"
					:class="['bar-piece', 'player-1', 'font-bold', { 'animate-pulse': allowedPointIndices.length > 0 }]"
				>
					{{ internalConfig.bar.player1 }}
				</div>
				<div v-if="internalConfig.bar.player2 > 0" class="bar-piece player-2 font-bold">
					{{ internalConfig.bar.player2 }}
				</div>
			</div>

			<!-- Right part of the board -->
			<div class="bin">
				<!-- Upper row -->
				<div class="row rotate-180">
					<PointComponent
						v-for="(pointConf, index) in internalConfig.points.slice(18, 24)"
						:key="index"
						:configuration="pointConf"
						:isEven="index % 2 === 0"
						:upperPoint="true"
						:available="allowedPointIndices.includes(index + 18)"
						:selected="srcPointIndex === index + 18"
						@select-point="selectPoint(index + 18)"
					/>
				</div>
				<!-- Lower row -->
				<div class="row">
					<PointComponent
						v-for="(pointConf, index) in internalConfig.points.slice(0, 6)"
						:key="index"
						:configuration="pointConf"
						:isEven="index % 2 === 0"
						:available="allowedPointIndices.includes(index)"
						:selected="srcPointIndex === index"
						@select-point="selectPoint(index)"
					/>
				</div>
			</div>
		</div>
		<div class="bear-off bg-gray-200 w-full h-full" id="bear-off" v-if="showBearOff">
			<div
				class="grid grid-cols-3 grid-rows-5 justify-items-center align-items-center gap-x-1 gap-y-1 p-2 aspect-square"
			>
				<div v-for="index in bearOffCountPlayer2" :key="index" class="piece player-2"></div>
			</div>
			<div id="divider"></div>
			<div
				class="grid grid-cols-3 grid-rows-5 justify-items-center align-items-center gap-x-1 gap-y-1 p-2 aspect-square"
				:style="{ backgroundColor: bearOffAllowed ? '#edd612' : '', cursor: bearOffAllowed ? 'pointer' : '' }"
				id="bear-off-1"
				@click="bearOffAllowed && selectPoint(-1)"
			>
				<div v-for="index in bearOffCountPlayer1" :key="index" class="piece player-1"></div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BoardConfiguration } from '@/models/BoardConfiguration';
import PointComponent from './PointComponent.vue';

export default defineComponent({
	name: 'GameBoard',
	emits: ['movePiece', 'noAvailableMoves'],
	components: {
		PointComponent,
	},
	props: {
		configuration: {
			type: BoardConfiguration,
			required: true,
		},
		player1: {
			type: Boolean,
			default: true,
		},
		dice: {
			type: Array as () => number[],
			required: true,
		},
		yourTurn: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		return {
			/* Copy of the displayed configuration */
			internalConfig: {} as BoardConfiguration,

			/* Dices available to the player */
			availableDice: null as number[] | null,

			/* Index of the point the player wants to move pieces from */
			srcPointIndex: null as number | null,

			/* The number of pieces per player */
			piecesPerPlayer: 15,
		};
	},
	created() {
		this.internalConfig = this.player1 ? { ...this.configuration } : this.swapPlayers(this.configuration);
    this.availableDice = [...this.dice];
    if (!this.isMoveAvailable) this.$emit('noAvailableMoves');
	},
	watch: {
		dice(newDice) {
			this.availableDice = [...newDice];
      if (!this.isMoveAvailable) this.$emit('noAvailableMoves');
		},
		configuration(newConfig) {
			this.internalConfig = this.player1 ? { ...newConfig } : this.swapPlayers(newConfig);
		},
	},
	methods: {
    /**
     * Checks if there is a winner in the game.
     */
    isThereAWinner() {
      return (this.internalConfig.points.every(point => point.player1 === 0) && this.internalConfig.bar.player1 === 0)
        || (this.internalConfig.points.every(point => point.player2 === 0) && this.internalConfig.bar.player2 === 0);
    },
		/**
		 * Selects a point to move pieces from or to.
		 * @param index Index of the selected point.
		 */
		selectPoint(index: number) {
      // If the game is over, do not allow any more moves
      if (this.isThereAWinner()) {
        return;
      }
      if (this.internalConfig.bar.player1 > 0) {
        this.movePiece(24, index) // Move piece from bar to point
      } else if (this.srcPointIndex === null) {
        this.srcPointIndex = index
      } else {
        this.movePiece(this.srcPointIndex, index) // Move piece from one point to another
      }
    },
    /**
     * Deselects the currently selected point.
     */
    deselectPoint() {
      this.srcPointIndex = null
    },
    checkDices(usedDice: number) {
      if (usedDice === Infinity || usedDice === undefined) {
        throw new Error('No valid dice')
      } else {
        const diceIndex = this.availableDice?.indexOf(usedDice)
        if (diceIndex !== -1 && diceIndex !== undefined) {
          this.availableDice?.splice(diceIndex, 1)
        }
      }
    },
    /**
     * Moves a piece from one point to another.
     * @param srcPointIndex Index of the source point (24 for the bar).
     * @param dstPointIndex Index of the destination point.
     */
    movePiece(srcPointIndex: number, dstPointIndex: number) {
      // TODO: Possibly replace all this code with a single API call to move a piece

			this.checkMoveValidity(srcPointIndex, dstPointIndex);

			// Move the piece
			if (srcPointIndex === 24) {
				this.internalConfig.bar.player1--;
			} else {
				this.internalConfig.points[srcPointIndex].player1--;
			}

			if (dstPointIndex >= 0) {
				this.internalConfig.points[dstPointIndex].player1++;

				// Hit the opponent's piece if there is only one
				if (this.internalConfig.points[dstPointIndex].player2 === 1) {
					this.internalConfig.points[dstPointIndex].player2 = 0;
					this.internalConfig.bar.player2++;
				}
			}

			// Update the available dice and reset the source point index
			const usedDice = this.availableDice?.reduce((min, dice) => {
				if (srcPointIndex - dice <= dstPointIndex && dice < min) {
					return dice;
				}
				return min;
			}, Infinity);

      this.checkDices(usedDice)

			this.srcPointIndex = null;

			// Emit the move to the parent component
			this.$emit('movePiece', this.player1 ? this.internalConfig : this.swapPlayers(this.internalConfig), usedDice);

			// Check if the player can still move pieces
			if (!this.availableDice || this.availableDice.length === 0 || this.allowedPointIndices.length === 0) {
				console.log('Dices have been used, switch players');
			}
		},
		/**
		 * Check the validity of a move
		 * @param srcPointIndex Index of the source point (24 for the bar).
		 * @param dstPointIndex Index of the destination point.
		 */
		checkMoveValidity(srcPointIndex: number, dstPointIndex: number) {
			if (srcPointIndex > 24 || srcPointIndex < 0 || dstPointIndex > 23 || dstPointIndex < -1)
				throw new Error('Indices are out of range');
			else if (this.internalConfig.bar.player1 >= 1 && srcPointIndex !== 24)
				throw new Error('You should move pieces out of the bar first!');
			else if (dstPointIndex > srcPointIndex) throw new Error('You cannot move to higher points!');
			else if (
				(srcPointIndex === 24 && this.internalConfig.bar.player1 <= 0) ||
				(srcPointIndex < 24 && this.internalConfig.points[srcPointIndex].player1 <= 0)
			)
				throw new Error('You have no pieces to move!');
			else if (!this.allowedPointIndices.includes(dstPointIndex))
				throw new Error('The destination point is not allowed');
		},
		/**
		 * Swaps the players on the board. Changes the perspective of the board.
		 * @param board Board configuration to swap the players on.
		 */
		swapPlayers(board: BoardConfiguration): BoardConfiguration {
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
		},
		/**
		 * Returns the indices of the points the player can select given the current board configuration,
		 * the available dices and the source point index.
		 */
		getAllowedPointIndices(
			boardConfig: BoardConfiguration,
			availableDice: number[] | null,
			srcPointIndex: number | null = null,
		) {
			if (!availableDice || availableDice.length === 0 || !this.yourTurn) {
				// No selection can be done if the dices have not been rolled or it is not you turn
				return [];
			} else if (boardConfig.bar.player1 > 0) {
				// There are pieces in the bar, return the points where the pieces can be moved to
				return availableDice
					.map(dice => 24 - dice)
					.filter(index => index <= 23 && index >= 0 && boardConfig.points[index].player2 <= 1);
			} else if (srcPointIndex === null) {
				// No point has been selected yet, return the points with pieces
				return boardConfig.points
					.map((point, index) => (point.player1 >= 1 ? index : -1))
					.filter(index => index !== -1);
			} else {
				// Find the points reachable from the selected point, with at most one opponent's piece
				const allowedIndices = availableDice
					.map(dice => (srcPointIndex ?? 24) - dice)
					.filter(index => index <= 23 && index >= 0 && boardConfig.points[index].player2 <= 1);

				// If the player has all pieces in base, allow moving pieces to the bear-off area
				if (
					boardConfig.points.slice(6, 24).every(point => point.player1 === 0) &&
					availableDice.some(dice => dice > (this.srcPointIndex ?? 0))
				) {
					allowedIndices.push(-1);
				}

				return allowedIndices;
			}
		},
	},
	computed: {
		/**
		 * Returns the indices of the points the player can select in the current stage of the game
		 * to move pieces from or to.
		 */
		allowedPointIndices() {
			return this.getAllowedPointIndices(this.internalConfig, this.availableDice, this.srcPointIndex);
		},
		/**
		 * Returns whether the player can make a move given the current board configuration and available dices.
		 */
		isMoveAvailable() {
			if (!this.yourTurn) {
				return false;
			} else if (this.internalConfig.bar.player1 > 0) {
				return this.getAllowedPointIndices(this.internalConfig, this.availableDice, 24).length > 0;
			} else {
				const possibleSrcIndices = this.getAllowedPointIndices(this.internalConfig, this.availableDice);
				return possibleSrcIndices.some(
					srcIndex => this.getAllowedPointIndices(this.internalConfig, this.availableDice, srcIndex).length > 0,
				);
			}
		},
		bearOffAllowed() {
			return this.allowedPointIndices.includes(-1);
		},
		bearOffCountPlayer1() {
			return (
				this.piecesPerPlayer -
				this.internalConfig.points.reduce((sum, point) => sum + point.player1, 0) -
				this.internalConfig.bar.player1
			);
		},
		bearOffCountPlayer2() {
			return (
				this.piecesPerPlayer -
				this.internalConfig.points.reduce((sum, point) => sum + point.player2, 0) -
				this.internalConfig.bar.player2
			);
		},
		showBearOff() {
			return this.bearOffCountPlayer1 + this.bearOffCountPlayer2 > 0 || this.allowedPointIndices.includes(-1);
		},
	},
});
</script>

<style scoped>
.board {
	border: 2em solid rgb(75 85 99);
	display: flex;
	box-shadow: 0px 0px 3px black;
}

#bar {
	background-color: rgb(75 85 99);
	min-width: 4em;
}

.bear-off {
	border: 1em solid rgb(75 85 99);
	display: flex;
	flex-direction: column;
	box-shadow: 0px 0px 3px black;
	max-width: 12vw;
}

#divider {
	background-color: rgb(75 85 99);
	min-height: 1em;
}

.bin {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 5em;
}

.row {
	display: flex;
	flex-direction: row-reverse;
	justify-content: space-around;
	width: 100%;
	aspect-ratio: 2;
}

@media (max-width: 768px) {
	/* Make the board and bar less thick on small screens */
	.board {
		border: 1em solid rgb(75 85 99);
	}

	#bar {
		min-width: 2em;
	}

	.bear-off {
		border: 0.5em solid rgb(75 85 99);
	}

	#divider {
		min-height: 0.5em;
	}
}

.bar-piece {
	width: 75%;
	aspect-ratio: 1;
	border-radius: 50%;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
}

.piece {
	height: 100%;
	aspect-ratio: 1;
	border-radius: 50%;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
}

.player-1 {
	background-color: #ff9797;
}

.player-2 {
	background-color: #a1a1ff;
}
</style>
