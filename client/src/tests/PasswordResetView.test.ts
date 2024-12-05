import { mount } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import PasswordResetView from '@/views/PasswordResetView.vue'

describe('PasswordResetView.vue', () => {
  let mock: InstanceType<typeof MockAdapter>;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  })

  afterEach(() => {
    mock.reset();
  })

   it('should set message on successful password reset', async () => {
    const wrapper = mount(PasswordResetView)
    wrapper.vm.newPassword = 'new_password123'
    wrapper.vm.confirmNewPassword = 'new_password123'

    const mockSuccessResponse = { message: 'Password has been reset' }
    mock.onPost('http://localhost:8000/password-reset').reply(200, mockSuccessResponse)

    await wrapper.vm.buttonResetPassword()

    expect(wrapper.vm.message).toBe('Password has been reset')
  })

  it('should set message on failed password reset', async () => {
    const wrapper = mount(PasswordResetView)
    wrapper.vm.newPassword = 'new_password123'
    wrapper.vm.confirmNewPassword = 'new_password123'

    const mockErrorResponse = { detail: 'Error resetting password' }
    mock.onPost('http://localhost:8000/password-reset').reply(400, mockErrorResponse)

    await wrapper.vm.buttonResetPassword()

    expect(wrapper.vm.message).toBe('Error resetting password')
  });
});
