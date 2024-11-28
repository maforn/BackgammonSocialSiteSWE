import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import router from '@/router'
import { googleSdkLoaded } from 'vue3-google-login'

export const registerOrLogin = async (
  username: string,
  password: string,
  email: string | undefined,
  isRegistering: boolean
) => {
  const data = {
    username: username,
    password: password
  }
  const response = await axios.post(
    `http://localhost:8000/${isRegistering ? 'register' : 'token'}`,
    isRegistering ? { ...data, email: email } : data
  )
  useAuthStore().setUserData(response.data.access_token, username)
}

export const requestPasswordRecovery = async (email: string) => {
  return await axios.post('http://localhost:8000/password-recovery', { email })
}

export const resetPassword = async (password: string, token: string) => {
  return await axios.post('http://localhost:8000/password-reset', { 'new_password': password, token })
}

export const logout = async () => {
  useAuthStore().logout()
  await router.push({ name: 'register' })
}

export function isAuthenticated(): boolean {
  return useAuthStore().isAuthenticated()
}

export const loginWithGoogle = () => {
  console.warn(import.meta.env.VITE_WS_URL)
  console.log(import.meta.env.VITE_GOOGLE_AUTH_ID)
  googleSdkLoaded(google => {
    google.accounts.oauth2
      .initCodeClient({
        client_id: import.meta.env.VITE_GOOGLE_AUTH_ID,
        scope: 'profile email https://www.googleapis.com/auth/contacts.readonly',
        redirect_uri: import.meta.env.VITE_APP_REDIRECT_URL,
        callback: async response => {
          if (response.code)
            try {
              const { data } = await axios.post('http://localhost:8000/google-login', { code: response.code })
              useAuthStore().setUserData(data.access_token, data.username)
              await router.push({ name: 'home' })
            } catch (error) {
              console.error('Error logging in with Google:', error)
            }
        }
      })
      .requestCode()
  })
}
