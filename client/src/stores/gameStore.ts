// client/src/stores/gameStore.ts
import { defineStore } from 'pinia'
import axiosInstance from '@/axios'
import { BoardConfiguration, PointConfiguration } from '@/models/BoardConfiguration'
import { Match } from '@/models/Match'
import '@/wasm/wasm_exec'
import { useAuthStore } from '@/stores/authStore'
import {
  checkMoveValidity,
  doRandomMove,
  findUsedDie,
  moveOnBoard,
  swapPlayers,
  updateAISuggestions
} from '@/services/gameService'
import { useWsStore } from '@/stores/wsStore'

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
  rounds_to_win: number;
  winsP1: number;
  winsP2: number;
  starter: number;
  startDice: { roll1: number; count1: number; roll2: number; count2: number };
  ai_suggestions: number[];
}

const ai_players = ['ai_hard', 'ai_medium', 'ai_easy']

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
    rounds_to_win: 0,
    winsP1: 0,
    winsP2: 0,
    goInstance: null,
    loaded: false,
    starter: -1,
    startDice: { roll1: 0, count1: 0, roll2: 0, count2: 0 },
    ai_suggestions: [0, 0]
  }),
  actions: {
    async initializeWasm() {
      if (!this.goInstance) {
        this.goInstance = new Go()
        const result = await WebAssembly.instantiateStreaming(fetch('lib.wasm'), this.goInstance.importObject)
        this.loaded = true
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
      this.player1 = data.player1
      this.player2 = data.player2
      this.boardConfiguration = new BoardConfiguration(
        data.board_configuration.points.map((p: PointConfiguration) => new PointConfiguration(p.player1, p.player2)),
        new PointConfiguration(data.board_configuration.bar.player1, data.board_configuration.bar.player2)
      )
      this.dice.roll = data.dice
      this.dice.available = data.available
      this.turn = data.turn
      this.created_at = new Date(data.created_at)
      this.updated_at = new Date(data.updated_at)
      this.status = data.status
      this.rounds_to_win = data.rounds_to_win
      this.winsP1 = data.winsP1
      this.winsP2 = data.winsP2
      this.starter = data.starter
      this.startDice = data.startDice
      this.ai_suggestions = data.ai_suggestions
      setTimeout(async () => await this.checkAITurn(), 800)
    },
    async getAISuggestions(isPlayer1) {
      if (this.ai_suggestions[isPlayer1 ? 1 : 0] >= 3) {
        useWsStore().addNotification('AI suggestions limit reached')
        return
      }

      const board = isPlayer1 ? swapPlayers(this.boardConfiguration) : this.boardConfiguration

      const input = {
        board: {
          o: {
            ...board.points.reduce((acc, point, index) => {
              if (point.player2 > 0) acc[index + 1] = point.player2
              return acc
            }, {}),
            bar: board.bar.player2
          },
          x: {
            ...board.points.reduce((acc, point, index) => {
              if (point.player1 > 0) acc[index + 1] = point.player1
              return acc
            }, {}),
            bar: board.bar.player1
          }
        },
        cubeful: false,
        dice: this.dice.roll,
        'max-moves':
          1,
        player:
          'x',
        'score-moves':
          true
      }
      const moves = await this.getMovesFromWasm(input)
      const validMoves = []
      moves[0].play.forEach(move => {
        try {
          checkMoveValidity(board, this.dice.roll, move.from - 1, move.to - 1)
          validMoves.push(` move ${move.from} to ${move.to}`)
        } catch {
          this.ai_suggestions[isPlayer1 ? 1 : 0] = 3
          return
        }
      })
      if (validMoves.length === 0) {
        useWsStore().addNotification('No valid moves from the AI :(')
      } else {
        await updateAISuggestions();
        this.ai_suggestions[isPlayer1 ? 1 : 0]++
        useWsStore().addNotification(`AI suggests:${validMoves.join(',')}.`)
      }
    },
    async checkAITurn() {
      const isPlayer1 = this.player1 === useAuthStore().username
      const isYourTurn = (this.turn % 2 === 0 && isPlayer1) || (this.turn % 2 === 1 && !isPlayer1)
      if (!isYourTurn && isPlayer1 ? ai_players.includes(this.player2) : ai_players.includes(this.player1)) {
        const diceRoll = this.dice.roll.length === 0 ? [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1] : this.dice.roll
        this.dice.roll = diceRoll
        this.dice.available = diceRoll

        const board = isPlayer1 ? swapPlayers(this.boardConfiguration) : this.boardConfiguration

        const input = {
          board: {
            o: {
              ...board.points.reduce((acc, point, index) => {
                if (point.player2 > 0) acc[index + 1] = point.player2
                return acc
              }, {}),
              bar: board.bar.player2
            },
            x: {
              ...board.points.reduce((acc, point, index) => {
                if (point.player1 > 0) acc[index + 1] = point.player1
                return acc
              }, {}),
              bar: board.bar.player1
            }
          },
          cubeful: false,
          dice: diceRoll,
          'max-moves':
            3,
          player:
            'x',
          'score-moves':
            true
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
      const isPlayer1 = this.player1 === useAuthStore().username
      let newBoard = !isPlayer1 ? { ...this.boardConfiguration } : swapPlayers(this.boardConfiguration)
      move.play.forEach((piece_move, index) => {

        const srcIndex = piece_move.from === 'bar' ? 24 : piece_move.from - 1;
        const dstIndex = piece_move.to === 'off' ? -1 : piece_move.to - 1;

        let usedDice = null

        try {
          console.log('moving')
          moveOnBoard(newBoard, this.dice.available, srcIndex, dstIndex)
          console.log('moved')
          usedDice = findUsedDie(this.dice.available, srcIndex, dstIndex)
          console.log('moved', usedDice)
        } catch (error: any) {
          console.log(error)
          const randomMove = doRandomMove(newBoard, this.dice.available)
          console.log('random', randomMove)
          if (randomMove) {
            usedDice = findUsedDie(this.dice.available, randomMove.src, randomMove.dst)
          }
          console.log('random', usedDice)
        }

        if (usedDice) {
          const diceIndex = this.dice.available.indexOf(usedDice)
          if (diceIndex !== -1 && diceIndex !== undefined) {
            this.dice.available?.splice(diceIndex, 1)
          }
        }

        this.boardConfiguration = isPlayer1 ? swapPlayers(newBoard) : newBoard
      })

      axiosInstance.post('/move/ai', {
        board: this.boardConfiguration
      })
    },
    async getMovesFromWasm(input: any) {
      await this.initializeWasm()
      console.log(JSON.stringify(input))
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
        this.rounds_to_win,
        this.starter
      )
    },
    setDice(result: number[], available: number[]) {
      this.dice.roll = result
      this.dice.available = available
    },
    setStartDice(roll1: number, count1: number, roll2: number, count2: number) {
			this.startDice = { roll1, count1, roll2, count2 };

		},
		setStarter(starter: number, turn: number) {
			this.starter = starter;
			this.turn = turn;
		}
  }
})
