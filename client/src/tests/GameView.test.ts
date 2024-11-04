import { mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import GameView from '@/views/GameView.vue'
import axiosInstance from '@/axios'
import MockAdapter from 'axios-mock-adapter'
import { createPinia, setActivePinia } from 'pinia'

describe('GameView.vue', () => {
  let mock: MockAdapter
  const pinia = createPinia()

  beforeAll(() => {
    mock = new MockAdapter(axiosInstance)
    setActivePinia(pinia)
  })

  afterEach(() => {
    mock.reset()
  })

  it('should fetch dice throw result and update diceResult on diceThrow method call', async () => {
    const getSpy = vi.spyOn(axiosInstance, 'get')
    mock.onGet('/throw_dice').reply(200, {
      die1: 3,
      die2: 5
    })

    const wrapper = mount(GameView, {
      pinia
    })
    await wrapper.vm.diceThrow()

    expect(getSpy).toHaveBeenCalledWith('/throw_dice')
    expect(wrapper.vm.diceResult.die1).toBe(3)
    expect(wrapper.vm.diceResult.die2).toBe(5)
  })
})
