import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const registerOrLogin = async (username: string, password: string, email: string | undefined, isRegistering: boolean) => {
  const data = {
    username: username,
    password: password
  }
  const response = await axios.post(`http://localhost:8000/${isRegistering ? 'register' : 'token'}`,
    isRegistering ? { ...data, email: email } : data
  )
  useAuthStore().setUserData(response.data.access_token, username)
}

export const logout = async () => {
  useAuthStore().logout()
}

export function isAuthenticated(): boolean {
  return useAuthStore().isAuthenticated()
}
