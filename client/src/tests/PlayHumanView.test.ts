import { mount } from '@vue/test-utils'
import { beforeAll, afterEach, describe, expect, it, vi } from 'vitest'
import PlayHumanView from '../views/PlayHumanView.vue'
import MockAdapter from 'axios-mock-adapter'
import axiosInstance from '@/axios'
import { createPinia, setActivePinia } from 'pinia'

describe('PlayHumanView.vue', () => {
  let mock: MockAdapter
  const pinia = createPinia()

  beforeAll(() => {
    mock = new MockAdapter(axiosInstance)
    setActivePinia(pinia)
  })

  afterEach(() => {
    mock.reset()
  })

  it('renders the view', () => {
    const wrapper = mount(PlayHumanView)
    expect(wrapper.exists()).toBe(true)
  })

  it('disables the invite button initially', () => {
    const wrapper = mount(PlayHumanView)
    const inviteButton = wrapper.find('#invite-btn')
    expect(inviteButton.attributes('disabled')).toBeDefined()
  })

  it('enables the invite button when a user is selected', async () => {
    const wrapper = mount(PlayHumanView)
    await wrapper.setData({ searchQuery: 'testuser', users: [{ id: 1, username: 'testuser' }], showDropdown: true })
    wrapper.vm.selectUser({ username: 'testuser' })
    await wrapper.vm.$nextTick()
    const inviteButton = wrapper.find('#invite-btn')
    expect(inviteButton.attributes('disabled')).toBeUndefined()
  })

  it('does not fetch users when input length is less than 2', async () => {
    const wrapper = mount(PlayHumanView)
    const fetchUsersSpy = vi.spyOn(wrapper.vm, 'fetchUsers')
    await wrapper.setData({ searchQuery: 't' })
    wrapper.vm.onInput()
    await wrapper.vm.$nextTick()
    expect(fetchUsersSpy).not.toHaveBeenCalled()
  })

  it('displays dropdown when users are fetched', async () => {
    const wrapper = mount(PlayHumanView)
    mock.onGet('/users/search').reply(200, [{ id: 1, username: 'testuser' }])
    await wrapper.setData({ searchQuery: 'test' })
    await wrapper.vm.fetchUsers()
    expect(wrapper.vm.showDropdown).toBe(true)
  })

  it('hides dropdown when no users are fetched', async () => {
    const wrapper = mount(PlayHumanView)
    mock.onGet('/users/search').reply(200, [])
    await wrapper.setData({ searchQuery: 'test' })
    await wrapper.vm.fetchUsers()
    expect(wrapper.vm.showDropdown).toBe(false)
  })
})
