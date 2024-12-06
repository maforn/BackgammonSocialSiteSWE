import { mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import GameView from '@/views/GameView.vue'
import axiosInstance from '@/axios'
import MockAdapter from 'axios-mock-adapter'
import { createPinia, setActivePinia } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import { useWsStore } from '@/stores/wsStore'
import { BoardConfiguration } from '@/models/BoardConfiguration'

describe('GameView.vue', () => {
  let mock: InstanceType<typeof MockAdapter>;
  const pinia = createPinia()

  beforeAll(() => {
    mock = new MockAdapter(axiosInstance)
    setActivePinia(pinia)
  })

  afterEach(() => {
    mock.reset()
  })

  it('renders players names and scores correctly', async () => {
    const wrapper = mount(GameView, {
      pinia
    })

    wrapper.vm.started = true
    wrapper.vm.player1 = 'Player 1'
    wrapper.vm.player2 = 'Player 2'
    wrapper.vm.rounds_to_win = 3
    wrapper.vm.winsP1 = 1
    wrapper.vm.winsP2 = 2
    await wrapper.vm.$nextTick()

    expect(wrapper.find('#p1-display').text()).toBe('Player 1')
    expect(wrapper.find('#p2-display').text()).toBe('Player 2')
    expect(wrapper.findAll('v-icon[name="bi-circle-fill"]').length).toBe(3)
    expect(wrapper.findAll('v-icon[name="bi-circle"]').length).toBe(3)
  })

  it('should fetch dice throw result and update diceResult on diceThrow method call', async () => {
    const getSpy = vi.spyOn(axiosInstance, 'get')
    mock.onGet('/throw_dice').reply(200)

    const wrapper = mount(GameView, {
      pinia
    })
    await wrapper.vm.diceThrow()

    useGameStore().setDice([3, 5], [4, 6])

    expect(getSpy).toHaveBeenCalledWith('/throw_dice')
    expect(wrapper.vm.diceResult.die1.value).toBe(3)
    expect(wrapper.vm.diceResult.die2.value).toBe(5)
    expect(wrapper.vm.availableDice).toEqual([4, 6])
  })

  it('should render preformed message buttons', async () => {
    const wrapper = mount(GameView, {
      pinia
    })

    let buttons = wrapper.findAll('.btn-preformed')
    expect(buttons.length).toBe(0) // Assuming there are 6 preformed messages

    wrapper.vm.started = true
    wrapper.vm.showMessages = true
    await wrapper.vm.$nextTick()

    buttons = wrapper.findAll('.btn-preformed')
    expect(buttons.length).toBe(6) // Assuming there are 6 preformed messages
    expect(buttons[0].text()).toBe('Great move! 👍')
  })

  it('should send preformed message on button click', async () => {
    const postSpy = vi.spyOn(axiosInstance, 'post')
    mock.onPost('/game/message').reply(200)

    const wrapper = mount(GameView, {
      pinia
    })

    wrapper.vm.started = true
    wrapper.vm.showMessages = true
    await wrapper.vm.$nextTick()

    const button = wrapper.find('.btn-preformed')
    await button.trigger('click')

    expect(postSpy).toHaveBeenCalledWith('/game/message', { message: 'Great move! 👍' })
  })

  it('shows the winner when the game is over', async () => {
    const gameStore = useGameStore()
    gameStore.status = 'player_1_won'
    const wrapper = mount(GameView, {
      global: {
        plugins: [pinia]
      }
    })
    await wrapper.vm.$nextTick()
    const winner = wrapper.find('#game-over')
    expect(winner.exists()).toBe(true)
  })

  it('does not shows the winner when the the game is not over', async () => {
    const gameStore = useGameStore()
    gameStore.status = 'started'
    const wrapper = mount(GameView, {
      global: {
        plugins: [pinia]
      }
    })
    await wrapper.vm.$nextTick()
    const winner = wrapper.find('#game-over')
    expect(winner.exists()).toBe(false)
  })

  it('should render messages correctly', async () => {
    const wsStore = useWsStore()
    wsStore.messages = [
      { id: 1, user: 'testuser', message: 'Hello' },
      { id: 2, user: 'opponent', message: 'Hi' }
    ]

    const wrapper = mount(GameView, {
      pinia
    })

    wrapper.vm.started = true
    await wrapper.vm.$nextTick()

    const messages = wrapper.findAll('.message')
    expect(messages.length).toBe(2)
    expect(messages[0].text()).toBe('Hello')
    expect(messages[1].text()).toBe('Hi')
  })

  it('Should start game', async () => {
    const wrapper = mount(GameView, {
      pinia
    })

    wrapper.vm.startPlaying()
    await wrapper.vm.$nextTick()

    const gameBoards = wrapper.findAllComponents({ name: 'GameBoard' })
    expect(gameBoards.length).toBeGreaterThan(0)
  })

  it('should not render the button pass the turn', () => {
    const wrapper = mount(GameView, {
      pinia
    })
    const button = wrapper.find('.btn-pass-turn')

    expect(button.exists()).toBe(false)
  })

  it('should open the correct URL when share buttons are clicked', async () => {
    const wrapper = mount(GameView, {
      pinia
    })

    // Set the necessary conditions for the game to be over
    wrapper.vm.started = true
    wrapper.vm.status = 'player_1_won'
    await wrapper.vm.$nextTick()

    // Ensure the gameOver condition is met
    expect(wrapper.find('#game-over').exists()).toBe(true)

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    await wrapper.vm.shareOnWhatsApp()
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('https://wa.me/?text='), '_blank')

    await wrapper.vm.shareOnTwitter()
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('https://twitter.com/intent/tweet?text='), '_blank')

    await wrapper.vm.shareOnFacebook()
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('https://www.facebook.com/sharer/sharer.php?u='), '_blank')

    openSpy.mockRestore()
  })

  it('should display the timer', async () => {
    const wrapper = mount(GameView, {
      pinia
    })

    wrapper.vm.started = true
    wrapper.vm.status = 'started'
    wrapper.vm.last_updated = new Date()
    await wrapper.vm.$nextTick()
    const timer = wrapper.vm.remainingTime
    await wrapper.vm.$nextTick()
    expect(timer).greaterThan(10)
  })


  it('calls the correct endpoint when movePiece is called', async () => {
    const wrapper = mount(GameView)
    const board = new BoardConfiguration()
    const dice = 4
    await wrapper.vm.movePiece(board, dice)
    expect(axiosInstance.post).toHaveBeenCalledWith('/move/piece', { board, dice })
  })

  it('calls the correct endpoint when throwStartDice is called', async () => {
    const wrapper = mount(GameView)
    await wrapper.vm.throwStartDice()
    expect(axiosInstance.get).toHaveBeenCalledWith('/throw_start_dice')
  })

  it('calls the correct endpoint when proposeDoubling is called', async () => {
    const wrapper = mount(GameView)
    await wrapper.vm.proposeDoubling()
    expect(axiosInstance.post).toHaveBeenCalledWith('/game/double/propose')
  })

  it('calls the correct endpoint when acceptDoubling is called', async () => {
    const wrapper = mount(GameView)
    await wrapper.vm.acceptDoubling()
    expect(axiosInstance.post).toHaveBeenCalledWith('/game/double/accept')
  })

  it('calls the correct endpoint when rejectDoubling is called', async () => {
    const wrapper = mount(GameView)
    await wrapper.vm.rejectDoubling()
    expect(axiosInstance.post).toHaveBeenCalledWith('/game/double/reject')
  })

  it('formatWinMessage should format the string correctly', async () => {
    const wrapper = mount(GameView)
    const board = new BoardConfiguration()
    board.points = board.points.map(() => ({ player1: 0, player2: 0 }))
    board.points[7] = { player1: 0, player2: 15 }
    expect(wrapper.vm.formatWinMessage('player1', true, board)).toBe('player1 has won the match with a gammon!')

    board.points[7] = { player1: 0, player2: 14 }
    expect(wrapper.vm.formatWinMessage('player1', true, board)).toBe('player1 has won the match!')

    board.points[7] = { player1: 0, player2: 0 }
    board.bar = { player1: 0, player2: 15 }
    expect(wrapper.vm.formatWinMessage('player1', true, board)).toBe('player1 has won the match with a backgammon!')
  })

  it('should call the requestTimeout method', async () => {
    const wrapper = mount(GameView, {
      pinia
    })

    const postSpy = vi.spyOn(axiosInstance, 'post')
    mock.onPost('/game/rematch').reply(200)

    wrapper.vm.requestTimeout()
    await wrapper.vm.$nextTick()

    expect(postSpy).toHaveBeenCalledWith('/game/request_timeout')
  })

  it('should update when starter changes', async () => {
    const gameStore = useGameStore()
    const wrapper = mount(GameView, {
      pinia
    })

    gameStore.starter = -1
    await wrapper.vm.$nextTick()
    gameStore.starter = 1
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.started).toBe(true)

    wrapper.vm.player1 = 'Player 1'
    wrapper.vm.player2 = 'Player 2'
    wrapper.vm.username = 'Player 2'
    wrapper.vm.starter = 0
    await wrapper.vm.$nextTick()
    wrapper.vm.starter = 2
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.initialText).toBe('You start!')

    wrapper.vm.starter = 1
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.initialText).toBe('Opponent starts!')
  })

  it('should update when winsP1 changes', async () => {
    const gameStore = useGameStore()
    const wrapper = mount(GameView, {
      pinia
    })

    gameStore.winsP1 = 2
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.winsP1).toBe(2)
  })

  it('should return the correct game over share text for player 2 winning', async () => {
    const wrapper = mount(GameView, {
      pinia
    })

    wrapper.vm.player1 = 'Player 1'
    wrapper.vm.player2 = 'Player 2'
    wrapper.vm.username = 'Player 2'
    wrapper.vm.status = 'player_2_won'
    await wrapper.vm.$nextTick()

    const shareText = wrapper.vm.getGameOverShareText()
    expect(shareText).toBe('I just won a game of backgammon against Player 1! 🏆 Play now!')
  })

  it('should return the correct game over share text for player 2 losing', async () => {
    const wrapper = mount(GameView, {
      pinia
    })

    wrapper.vm.player1 = 'Player 1'
    wrapper.vm.player2 = 'Player 2'
    wrapper.vm.username = 'Player 2'
    wrapper.vm.status = 'player_1_won'
    await wrapper.vm.$nextTick()

    const shareText = wrapper.vm.getGameOverShareText()
    expect(shareText).toBe('I just lost a game of backgammon against Player 1! 😢 Help me out, play now!')
  })

  it('calls the correct endpoint when passTheTurn is called', async () => {
    const wrapper = mount(GameView, {
      pinia
    })

    const postSpy = vi.spyOn(axiosInstance, 'post')
    mock.onPost('/game/pass_turn').reply(200)

    await wrapper.vm.passTheTurn()
    expect(postSpy).toHaveBeenCalledWith('/game/pass_turn')
  })

  it('calls the correct endpoint when confirmQuit is called', async () => {
    const wrapper = mount(GameView, {
      pinia
    })

    const postSpy = vi.spyOn(axiosInstance, 'post')
    mock.onPost('/game/quit').reply(200)

    await wrapper.vm.confirmQuit()
    expect(postSpy).toHaveBeenCalledWith('/game/quit')
  })

  it('calls the correct endpoint when cancelQuit is called', async () => {
    const wrapper = mount(GameView, {
      pinia
    })

    wrapper.vm.isModalVisible = true
    wrapper.vm.cancelQuit()
    expect(wrapper.vm.isModalVisible).toBe(false)
  })

})
