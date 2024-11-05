// client/src/stores/gameStore.ts
import { defineStore } from 'pinia'

interface Player {
  username: string
  score: number
}

interface DiceResult {
  die1: number | null
  die2: number | null
}

interface GameBoard {
  // Define the structure of the game board
  // For simplicity, let's assume it's an array of arrays representing the board state
  board: number[][]
}

interface GameState {
  players: Player[]
  currentPlayer: number
  diceResult: DiceResult
  gameBoard: GameBoard
  gameStatus: 'not_started' | 'in_progress' | 'finished'
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    players: [],
    currentPlayer: 0,
    diceResult: { die1: null, die2: null },
    gameBoard: { board: Array(24).fill([]) }, // Example board initialization
    gameStatus: 'not_started'
  }),
  actions: {
    addPlayer(player: Player) {
      this.players.push(player)
    },
    startGame() {
      if (this.players.length === 2) {
        this.gameStatus = 'in_progress'
        this.currentPlayer = 0
      } else {
        throw new Error('Two players are required to start the game')
      }
    },
    setDice(die1: number, die2: number) {
      this.diceResult.die1 = die1
      this.diceResult.die2 = die2
    },
    movePiece(from: number, to: number) {
      // Implement the logic to move a piece on the board
      // This is a simplified example
    },
    endTurn() {
      this.currentPlayer = (this.currentPlayer + 1) % 2
    },
    finishGame() {
      this.gameStatus = 'finished'
    }
  }
})
