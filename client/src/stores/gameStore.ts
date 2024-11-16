// client/src/stores/gameStore.ts
import { defineStore } from 'pinia'
import axiosInstance from '@/axios'
import { BoardConfiguration, PointConfiguration } from '@/models/BoardConfiguration'
import { Match } from '@/models/Match'
import '@/wasm/wasm_exec'
import { useAuthStore } from '@/stores/authStore'

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
}

const ai_players = ['ai_hard', 'ai_medium', 'ai_easy'];

export const useGameStore = defineStore('game', {
  state: (): Match & { goInstance: Go | null, loaded: boolean } => ({
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
    goInstance: null,
    loaded : false
  }),
  actions: {
    async initializeWasm() {
      if (!this.goInstance) {
        this.goInstance = new Go()
        const result = await WebAssembly.instantiateStreaming(fetch('lib.wasm'), this.goInstance.importObject)
        this.loaded = true;
        await this.goInstance.run(result.instance)
      }
    },
    fetchGame() {
      this.initializeWasm()
      return axiosInstance.get('/game').then(async (response) => {
        const data = response.data
        await this.setMatch(data)
      })
    },
    checkSuspendedGameExists() {
      return axiosInstance.get('/game/exists').then(response => {
        return response.data
      })
    },
    async setMatch(data: GameData) {
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
      setTimeout(async () => await this.checkAITurn(), 1000)
    },
    async checkAITurn() {
      const isPlayer1 = this.player1 === useAuthStore().username
      const isYourTurn = (this.turn % 2 === 0 && isPlayer1) || (this.turn % 2 === 1 && !isPlayer1)
      if (!isYourTurn && isPlayer1 ? ai_players.includes(this.player2) : ai_players.includes(this.player1)) {
        const diceRoll = this.dice.roll.length === 0 ? [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1] : this.dice.roll
        this.dice.roll = diceRoll
        this.dice.available = diceRoll

        const board = isPlayer1 ? this.swapPlayers(this.boardConfiguration) : this.boardConfiguration

        const input = {
          board: {
            o: board.points.reduce((acc, point, index) => {
              if (point.player2 > 0) acc[index + 1] = point.player2
              return acc
            }, {}),
            x: board.points.reduce((acc, point, index) => {
              if (point.player1 > 0) acc[index + 1] = point.player1
              return acc
            }, {})
          },
          cubeful: false,
          dice: diceRoll,
          'max-moves': 3,
          player: 'x',
          'score-moves': true
        }
        const moves = await this.getMovesFromWasm(input)
        switch (isPlayer1 ? this.player2 : this.player1) {
          case 'ai_hard':
            setTimeout(() => this.makeAIMove(moves[0]), 1000)
            break
          case 'ai_medium':
            setTimeout(() => this.makeAIMove(moves[Math.floor(Math.random() * moves.length - 1)]), 1000)
            break
          case 'ai_easy':
            setTimeout(() => this.makeAIMove(moves[Math.floor(Math.random() * moves.length)]), 1000)
            break
        }
      }
    },
    makeAIMove(move: any) {
      const isPlayer1 = this.player1 === useAuthStore().username;
      let newBoard = !isPlayer1 ? {...this.boardConfiguration} : this.swapPlayers(this.boardConfiguration);
      move.play.forEach((piece_move, index) => {

        const srcIndex = piece_move.from - 1;
        const dstIndex = piece_move.to - 1;

        console.log(srcIndex, newBoard.points[srcIndex].player1, dstIndex, newBoard.points[dstIndex].player1);

        const usedDice = this.moveOnBoard(newBoard, srcIndex, dstIndex);

        console.log("Used dice", usedDice);

        const diceIndex = this.dice.available.indexOf(usedDice);
				if (diceIndex !== -1 && diceIndex !== undefined) {
					this.dice.available?.splice(diceIndex, 1);
				}

        this.boardConfiguration = isPlayer1 ? this.swapPlayers(newBoard) : newBoard;
      })

      axiosInstance.post('/move/ai', {
        board: this.boardConfiguration
      });
    },
    moveOnBoard(board: BoardConfiguration, srcPointIndex: number, dstPointIndex: number) : number{
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

			// Update the available dice and reset the source point index
			let usedDice = this.dice.available?.reduce((min, dice) => {
				if (srcPointIndex - dice <= dstPointIndex && dice < min) {
					return dice;
				}
				return min;
			}, Infinity);

			if (usedDice === Infinity || usedDice === undefined) {
				throw new Error('No valid dice');
      }
      else{
        return usedDice;
      }
    },
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
    async getMovesFromWasm(input: any) {
      await this.initializeWasm()
      while (!this.loaded) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      const output = globalThis.wasm_get_moves(JSON.stringify(input))
      return JSON.parse(output)
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
			);
		},
    setDice(result: number[], available: number[]) {
			this.dice.roll = result;
			this.dice.available = available;
		},
  }
})
