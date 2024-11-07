import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import ErrorContainer from '@/components/ErrorContainer.vue'
import { useWsStore } from '@/stores/wsStore'
import { createPinia, setActivePinia } from 'pinia'

describe('ErrorContainer.vue', () => {
  const pinia = createPinia()

  beforeAll(() => {
    setActivePinia(pinia)
  })

  it('renders error and notification messages', () => {
    const store = useWsStore()
    store.addError('Error message')
    store.addNotification('Notification message')
    const wrapper = mount(ErrorContainer, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.text()).toContain('Error message')
    expect(wrapper.text()).toContain('Notification message')
  })
})
