import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { logout, registerOrLogin } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('axios')

describe('auth service', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useAuthStore().logout()
  })

  it('should register a user', async () => {
    const mockResponse = { data: { access_token: 'fake_token' } }
    axios.post = vi.fn().mockResolvedValue(mockResponse)

    await registerOrLogin('testuser', 'password', 'test@example.com', true)

    expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/register', {
      username: 'testuser',
      password: 'password',
      email: 'test@example.com'
    })
    expect(useAuthStore().token).toBe('fake_token')
    expect(useAuthStore().username).toBe('testuser')
  })

  it('should login a user', async () => {
    const mockResponse = { data: { access_token: 'fake_token' } }
    axios.post = vi.fn().mockResolvedValue(mockResponse)

    await registerOrLogin('testuser', 'password', undefined, false)

    expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/token', {
      username: 'testuser',
      password: 'password'
    })
    expect(useAuthStore().token).toBe('fake_token')
    expect(useAuthStore().username).toBe('testuser')
  })

  it('should logout a user', () => {
    useAuthStore().setUserData('fake_token', 'testuser')
    logout()
    expect(useAuthStore().token).toBeNull()
    expect(useAuthStore().token).toBeNull()
  })
})
