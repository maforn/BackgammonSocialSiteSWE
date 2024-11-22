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

  it('should render preformed message buttons', () => {
    const wrapper = mount(GameView, {
      pinia,
    });

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

    const button = wrapper.find('.btn-preformed');
    await button.trigger('click');

    expect(postSpy).toHaveBeenCalledWith('/game/message', { message: 'Ottima mossa!' });
  });

  it('should render messages correctly', () => {
    const wsStore = useWsStore();
    wsStore.messages = [
      { id: 1, user: 'testuser', message: 'Hello' },
      { id: 2, user: 'opponent', message: 'Hi' },
    ];

    const wrapper = mount(GameView, {
      pinia,
    });

    const messages = wrapper.findAll('.message');
    expect(messages.length).toBe(2);
    expect(messages[0].text()).toBe('Hello');
    expect(messages[1].text()).toBe('Hi');
  });

  it('should not render the button pass the turn',()=>{

    const wrapper = mount(GameView, {
      pinia,
    });
    const button = wrapper.find('.btn-pass-turn');

    expect(button.exists()).toBe(false);
  });

  it('should render the button pass the turn',async ()=>{
    const wrapper = mount(GameView, {
      pinia,
    });


    useGameStore().setDice([3, 5], [3, 5]);
    useGameStore().$state.turn = 1;
    await wrapper.getComponent(GameBoard).vm.$emit('noAvailableMoves');

    await wrapper.vm.$nextTick();

    const button = wrapper.find('.btn-pass-turn');
    expect(button.exists()).toBe(true);
  });

});
