import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import App from '@/App.vue'
import { createPinia } from 'pinia'
import router from '@/router'
import { useWsStore } from '@/stores/wsStore'
import { useAuthStore } from '@/stores/authStore'

describe('App.vue', () => {
  it('renders without crashing', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('watches auth store token', async () => {
    const pinia = createPinia()
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router]
      }
    })
    vi.fn().mockImplementation(() => null)
    useWsStore().connect = vi.fn()
    const authStore = useAuthStore()
    authStore.token = 'token'
    await wrapper.vm.$nextTick()
    expect(useWsStore().connect).toHaveBeenCalled()
  })
})
