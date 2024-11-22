import { mount } from '@vue/test-utils';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import GameView from '@/views/GameView.vue';
import axiosInstance from '@/axios';
import MockAdapter from 'axios-mock-adapter';
import { createPinia, setActivePinia } from 'pinia';
import { useGameStore } from '@/stores/gameStore';
import { useWsStore } from '@/stores/wsStore';
import GameBoard from "@/components/GameBoard.vue";

describe('GameView.vue', () => {
  let mock: MockAdapter;
  const pinia = createPinia();

  beforeAll(() => {
    mock = new MockAdapter(axiosInstance);
    setActivePinia(pinia);
  });

  afterEach(() => {
    mock.reset();
  });

  it('renders players names and scores correctly', async () => {
    const wrapper = mount(GameView, {
      pinia,
    });

    wrapper.vm.started = true;
    wrapper.vm.player1 = 'Player 1';
    wrapper.vm.player2 = 'Player 2';
    wrapper.vm.rounds_to_win = 3;
    wrapper.vm.winsP1 = 1;
    wrapper.vm.winsP2 = 2;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('#p1-display').text()).toBe('Player 1');
    expect(wrapper.find('#p2-display').text()).toBe('Player 2');
    expect(wrapper.findAll('v-icon[name="bi-circle-fill"]').length).toBe(3)
    expect(wrapper.findAll('v-icon[name="bi-circle"]').length).toBe(3)
  })

  it('should fetch dice throw result and update diceResult on diceThrow method call', async () => {
    const getSpy = vi.spyOn(axiosInstance, 'get');
    mock.onGet('/throw_dice').reply(200);

    const wrapper = mount(GameView, {
      pinia,
    });
    await wrapper.vm.diceThrow();

		useGameStore().setDice([3, 5], [4, 6]);

		expect(getSpy).toHaveBeenCalledWith('/throw_dice');
		expect(wrapper.vm.diceResult.die1.value).toBe(3);
		expect(wrapper.vm.diceResult.die2.value).toBe(5);
		expect(wrapper.vm.availableDice).toEqual([4, 6]);
	});

  it('should render preformed message buttons', async () => {
    const wrapper = mount(GameView, {
      pinia,
    });

    wrapper.vm.started = true;
    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAll('.btn-preformed');
    expect(buttons.length).toBe(6); // Assuming there are 6 preformed messages
    expect(buttons[0].text()).toBe('Ottima mossa!');
  });

  it('should send preformed message on button click', async () => {
    const postSpy = vi.spyOn(axiosInstance, 'post');
    mock.onPost('/game/message').reply(200);

    const wrapper = mount(GameView, {
      pinia,
    });

    wrapper.vm.started = true;
    await wrapper.vm.$nextTick();

    const button = wrapper.find('.btn-preformed');
    await button.trigger('click');

    expect(postSpy).toHaveBeenCalledWith('/game/message', { message: 'Ottima mossa!' });
  });

  it('shows the winner when the game is over', async () => {
    const gameStore = useGameStore();
    gameStore.status = 'player_1_won';
    const wrapper = mount(GameView, {
      global: {
        plugins: [pinia],
      },
    });
    await wrapper.vm.$nextTick();
    const winner = wrapper.find('#game-over');
    expect(winner.exists()).toBe(true);
  });

  it('does not shows the winner when the the game is not over', async () => {
    const gameStore = useGameStore();
    gameStore.status = 'started';
    const wrapper = mount(GameView, {
      global: {
        plugins: [pinia],
      },
    });
    await wrapper.vm.$nextTick();
    const winner = wrapper.find('#game-over');
    expect(winner.exists()).toBe(false);
  });

  it('should render messages correctly', async () => {
    const wsStore = useWsStore();
    wsStore.messages = [
      { id: 1, user: 'testuser', message: 'Hello' },
      { id: 2, user: 'opponent', message: 'Hi' },
    ];

    const wrapper = mount(GameView, {
      pinia,
    });

    wrapper.vm.started = true;
    await wrapper.vm.$nextTick();

    const messages = wrapper.findAll('.message');
    expect(messages.length).toBe(2);
    expect(messages[0].text()).toBe('Hello');
    expect(messages[1].text()).toBe('Hi');
  });

  it('Should start game', async () => {
    const wrapper = mount(GameView, {
      pinia,
    });

    wrapper.vm.startPlaying();
    await wrapper.vm.$nextTick();

    const gameBoards = wrapper.findAllComponents({ name: 'GameBoard' });
    expect(gameBoards.length).toBeGreaterThan(0);
  });

  it('should not render the button pass the turn',()=>{

    const wrapper = mount(GameView, {
      pinia,
    });
    const button = wrapper.find('.btn-pass-turn');

    expect(button.exists()).toBe(false);
  });

});
