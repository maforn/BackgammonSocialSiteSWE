import { beforeEach, describe, expect, it, vi } from 'vitest'
import axiosInstance from '@/axios'
import MockAdapter from 'axios-mock-adapter'
import { createPinia, setActivePinia } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import { BoardConfiguration, PointConfiguration } from '@/models/BoardConfiguration'
import { useWsStore } from '@/stores/wsStore'
import { useAuthStore } from '@/stores/authStore'

describe('game store', () => {
  let mock: InstanceType<typeof MockAdapter>

  beforeEach(() => {
    setActivePinia(createPinia())
    mock = new MockAdapter(axiosInstance)
  })

  function getStandardGameData(now: Date) {
    return {
      player1: 'Alice',
      player2: 'Bob',
      board_configuration: new BoardConfiguration(),
      dice: [1, 3],
      available: [1, 3],
      turn: 1,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      status: 'active',
      rounds_to_win: 1,
      winsP1: 0,
      winsP2: 0,
      starter: 1,
      startDice: { roll1: 0, count1: 0, roll2: 0, count2: 0 },
      ai_suggestions: [0, 0],
      doublingCube: { count: 0, last_usage: 0, proposed: false, proposer: 0 },
      last_updated: now.toISOString()
    }
  }

  it('should set and get match', () => {
    const now = new Date()

    const gameStore = useGameStore()
    gameStore.setMatch(getStandardGameData(now))

    expect(gameStore.status).toEqual('active')
  })

  it('should fetch game data and set match', async () => {
    const mockResponse = {
      player1: 'Alice',
      player2: 'Bob',
      board_configuration: new BoardConfiguration(),
      dice: [1, 2],
      available: [3, 4],
      turn: 1,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      status: 'active'
    }
    mock.onGet('/game').reply(200, mockResponse)

    const gameStore = useGameStore()
    await gameStore.fetchGame()

    expect(gameStore.player1).toBe('Alice')
    expect(gameStore.player2).toBe('Bob')
    expect(gameStore.boardConfiguration).toEqual(new BoardConfiguration())
    expect(gameStore.dice.roll).toEqual([1, 2])
    expect(gameStore.dice.available).toEqual([3, 4])
    expect(gameStore.turn).toBe(1)
    expect(gameStore.created_at.toISOString()).toBe('2023-01-01T00:00:00.000Z')
    expect(gameStore.updated_at.toISOString()).toBe('2023-01-01T00:00:00.000Z')
    expect(gameStore.status).toBe('active')
  })

  it('should set dice correctly', () => {
    const gameStore = useGameStore()
    gameStore.setDice([3, 4], [5, 6])
    expect(gameStore.dice.roll).toEqual([3, 4])
    expect(gameStore.dice.available).toEqual([5, 6])
  })

  it('should handle AI move correctly', async () => {
    const gameStore = useGameStore()
    gameStore.player1 = 'Alice'
    gameStore.player2 = 'ai_easy'
    gameStore.boardConfiguration = new BoardConfiguration(
      Array(24).fill(new PointConfiguration(1, 0)),
      new PointConfiguration(0, 0)
    )
    gameStore.dice.roll = [1, 3]
    gameStore.dice.available = [1, 3]
    gameStore.turn = 1

    mock.onPost('/move/ai').reply(200)

    gameStore.makeAIMove({ play: [{ from: 23, to: 22 }] })

    expect(gameStore.dice.available.length).toBe(1)
  })

  it('should display error on more AI suggestions than permitted', async () => {
    const gameStore = useGameStore()
    gameStore.ai_suggestions = [3, 3]
    gameStore.getAISuggestions(false)
    expect(useWsStore().errors.length).greaterThan(0)
  })

  it('should display AI suggestions', async () => {
    const gameStore = useGameStore()
    await gameStore.setMatch(getStandardGameData(new Date()))
    mock.onPost('/ai/suggestions').reply(200)
    const mockGetMoves = vi.fn().mockImplementation(() => [
      {
        play: [
          {
            from: 24,
            to: 23
          }
        ]
      }])
    gameStore.getMovesFromWasm = mockGetMoves
    await gameStore.getAISuggestions(true)
    expect(mockGetMoves).toHaveBeenCalledOnce()
    expect(useWsStore().notifications.length).greaterThan(0)
  })

  it('should set starter correctly', async () => {
    const gameStore = useGameStore()
    gameStore.setStarter(2, 3)
    expect(gameStore.starter).toBe(2)
    expect(gameStore.turn).toBe(3)
  })

  it('should call checkAITurn correctly', async () => {
    const gameStore = useGameStore()
    useAuthStore().username = 'Alice'
    const defaultGame = getStandardGameData(new Date())
    defaultGame.player2 = 'ai_easy'
    await gameStore.setMatch(defaultGame)
    const mockGetMoves = vi.fn().mockImplementation(() => [
      {
        play: [
          {
            from: 24,
            to: 23
          }
        ]
      }])
    gameStore.getMovesFromWasm = mockGetMoves
    mock.onPost('/move/ai').reply(200)

    await gameStore.checkAITurn()

    expect(mockGetMoves).toHaveBeenCalledOnce()
  })

  it('should set the start dice correctly', async () => {
    const gameStore = useGameStore()
    gameStore.setStartDice(1, 1, 1, 1)
    expect(gameStore.startDice.roll1).toBe(1)
  })

  it('should return get used dice correctly', async () => {
    const gameStore = useGameStore()
    await gameStore.setMatch(getStandardGameData(new Date()))
    const diceUsed = gameStore.getUsedDice(new BoardConfiguration(), 23, 22)
    expect(diceUsed).toBe(1)
  })
})
