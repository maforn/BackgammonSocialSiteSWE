import { mount } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import PasswordRecoveryView from '@/views/PasswordRecoveryView.vue'

describe('PasswordRecoveryView.vue', () => {
  let mock: InstanceType<typeof MockAdapter>;

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.reset()
  })

  it('should set message on successful password recovery', async () => {
    const wrapper = mount(PasswordRecoveryView)
    wrapper.vm.email = 'valid_email@example.com'

    const mockSuccessResponse = { message: 'Password recovery email sent' }
    mock.onPost(`${import.meta.env.VITE_API_URL}/api/password-recovery`).reply(200, mockSuccessResponse)

    await wrapper.vm.buttonRequestPasswordRecovery()

    expect(wrapper.vm.message).toBe('Password recovery email sent')
  })

  it('should set message on failed password recovery', async () => {
    const wrapper = mount(PasswordRecoveryView)
    wrapper.vm.email = 'invalid_email@example.com'

    const mockErrorResponse = { detail: 'Error sending recovery email' }
    mock.onPost(`${import.meta.env.VITE_API_URL}/api/password-recovery`).reply(400, mockErrorResponse)

    await wrapper.vm.buttonRequestPasswordRecovery()

    expect(wrapper.vm.message).toBe('Error sending recovery email')
  })
})
