import { beforeEach, describe, expect, it } from 'vitest'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { googleCallback, logout, registerOrLogin, requestPasswordRecovery, resetPassword } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { createPinia, setActivePinia } from 'pinia'

describe('auth service', () => {
  let mock: InstanceType<typeof MockAdapter>

	beforeEach(() => {
		setActivePinia(createPinia());
		useAuthStore().logout();
		mock = new MockAdapter(axios);
	});

  it('should register a user', async () => {
    const mockResponse = { access_token: 'fake_token' }
    mock.onPost(`${import.meta.env.VITE_API_URL}/api/register`).reply(200, mockResponse)

		await registerOrLogin('testuser', 'password', 'test@example.com', true);

    expect(mock.history.post[0].url).toBe(`${import.meta.env.VITE_API_URL}/api/register`)
    expect(mock.history.post[0].data).toBe(
      JSON.stringify({
        username: 'testuser',
        password: 'password',
        email: 'test@example.com'
      })
    )
    expect(useAuthStore().token).toBe('fake_token')
    expect(useAuthStore().username).toBe('testuser')
  })

  it('should throw an error', async () => {
    const mockResponse = { details: 'Error message' }
    mock.onPost(`${import.meta.env.VITE_API_URL}/api/register`).reply(422, mockResponse)

		try {
			await registerOrLogin('testuser', 'password', 'test@example.com', true);
		} catch (error: any) {
			expect(error.response.data.details).toBe('Error message');
		}

    expect(mock.history.post[0].url).toBe(`${import.meta.env.VITE_API_URL}/api/register`)
    expect(mock.history.post[0].data).toBe(
      JSON.stringify({
        username: 'testuser',
        password: 'password',
        email: 'test@example.com'
      })
    )
  })

  it('should login a user', async () => {
    const mockResponse = { access_token: 'fake_token' }
    mock.onPost(`${import.meta.env.VITE_API_URL}/api/token`).reply(200, mockResponse)

		await registerOrLogin('testuser', 'password', undefined, false);

    expect(mock.history.post[0].url).toBe(`${import.meta.env.VITE_API_URL}/api/token`)
    expect(mock.history.post[0].data).toBe(
      JSON.stringify({
        username: 'testuser',
        password: 'password'
      })
    )
    expect(useAuthStore().token).toBe('fake_token')
    expect(useAuthStore().username).toBe('testuser')
  })

  it('should logout a user', () => {
    useAuthStore().setUserData('fake_token', 'testuser')
    logout()
    expect(useAuthStore().token).toBeNull()
    expect(useAuthStore().username).toBeNull()
  })

  it('should request password recovery', async () => {
    mock.onPost(`${import.meta.env.VITE_API_URL}/api/password-recovery`).reply(200)

    await requestPasswordRecovery('test@example.com')

    expect(mock.history.post[0].url).toBe(`${import.meta.env.VITE_API_URL}/api/password-recovery`)
    expect(mock.history.post[0].data).toBe(
      JSON.stringify({
        email: 'test@example.com'
      })
    )
  })

  it('should reset password', async () => {
    mock.onPost(`${import.meta.env.VITE_API_URL}/api/password-reset`).reply(200)

    await resetPassword('new_password', 'reset_token')

    expect(mock.history.post[0].url).toBe(`${import.meta.env.VITE_API_URL}/api/password-reset`)
    expect(mock.history.post[0].data).toBe(
      JSON.stringify({
        new_password: 'new_password',
        token: 'reset_token'
      })
    )
  })

  it('should handle google callback', async () => {
    mock.onPost('https://oauth2.googleapis.com/token').reply( 200, {id_token: 'bbb', access_token: 'ddd'})
    mock.onPost(`${import.meta.env.VITE_API_URL}/api/google-login`).reply( 200, {access_token: 'aaaa', username: 'testuser'})
    const response = googleCallback();
    await response( {code: 'ccc'});
    const authStore = useAuthStore();
    expect(authStore.username).toBe('testuser')
    expect(authStore.token).toBe('aaaa')
    expect(authStore.google_token).toBe('ddd')
  })
})
