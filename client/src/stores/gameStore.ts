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
  used: number[];
  turn: number;
  created_at: string;
  updated_at: string;
  status: string;
  first_to: number;
}

export const useGameStore = defineStore('game', {
  state: (): Match & { goInstance: Go | null } => ({
    player1: '',
    player2: '',
    boardConfiguration: new BoardConfiguration(),
    dice: { roll: [], used: [] },
    turn: 0,
    created_at: new Date(),
    updated_at: new Date(),
    status: 'pending',
    first_to: 0,
    winsP1: 0,
    winsP2: 0,
    goInstance: null
  }),
  actions: {
    async initializeWasm() {
      if (!this.goInstance) {
        this.goInstance = new Go()
        const result = await WebAssembly.instantiateStreaming(fetch('lib.wasm'), this.goInstance.importObject)
        await this.goInstance.run(result.instance)
        await this.fetchGame()
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
      this.dice.used = data.used
      this.turn = data.turn
      this.created_at = new Date(data.created_at)
      this.updated_at = new Date(data.updated_at)
      this.status = data.status
      this.first_to = data.first_to
      await this.checkAITurn()
    },
    async checkAITurn() {
      const isPlayer1 = this.player1 === useAuthStore().username
      const isYourTurn = (this.turn % 2 === 0 && isPlayer1) || (this.turn % 2 === 1 && !isPlayer1)
      console.log('Is your turn:', isYourTurn, 'Is player 1:', isPlayer1, 'Player 1:', this.player1, 'Player 2:', this.player2, !isYourTurn && isPlayer1 ? this.player2.startsWith('ai') : this.player1.startsWith('ai'))
      if (!isYourTurn && isPlayer1 ? this.player2.startsWith('ai') : this.player1.startsWith('ai')) {
        const diceRoll = this.dice.roll.length === 0 ? [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1] : this.dice.roll
        const input = {
          board: {
            o: this.boardConfiguration.points.reduce((acc, point, index) => {
              if (point.player2 > 0) acc[index + 1] = point.player2
              return acc
            }, {}),
            x: this.boardConfiguration.points.reduce((acc, point, index) => {
              if (point.player1 > 0) acc[index + 1] = point.player1
              return acc
            }, {})
          },
          cubeful: false,
          dice: diceRoll,
          'max-moves': 3,
          player: isPlayer1 ? 'o' : 'x',
          'score-moves': true
        }
        const moves = await this.getMovesFromWasm(input)
        console.log('AI Moves:', moves)
        // Implement logic to make the AI move
      }
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
        this.first_to
      )
    },
    setDice(die1: number, die2: number) {
      this.dice.roll = [die1, die2]
    }
  }
})
