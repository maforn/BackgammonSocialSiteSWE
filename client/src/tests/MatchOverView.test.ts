import { mount } from '@vue/test-utils'
import MatchOverView from '@/views/MatchOverView.vue'
import axiosInstance from '@/axios'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import { createPinia, setActivePinia } from 'pinia'

describe('MatchOverView.vue', () => {
  let mock: InstanceType<typeof MockAdapter>

  const pinia = createPinia()

  beforeAll(() => {
    setActivePinia(pinia)
  })

  beforeEach(async () => {
    mock = new MockAdapter(axiosInstance)
    mock.onGet('/users/me').reply(200, { data: { username: 'testuser' } })
  })

  afterEach(() => {
    mock.reset()
  })

  it('renders correctly', () => {
    const wrapper = mount(MatchOverView)
    expect(wrapper.exists()).toBe(true)
  })

})
