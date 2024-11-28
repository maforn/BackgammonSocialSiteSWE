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
  googleSdkLoaded(google => {
    google.accounts.oauth2
      .initCodeClient({
        client_id: import.meta.env.VITE_GOOGLE_AUTH_ID,
        scope: 'profile email https://www.googleapis.com/auth/contacts.readonly',
        redirect_uri: import.meta.env.VITE_APP_REDIRECT_URL,
        callback: async response => {
          const code = response.code
          if (code)
            try {
              const response = await axios.post(
            "https://oauth2.googleapis.com/token",
            {
                  code,
                  client_id: import.meta.env.VITE_GOOGLE_AUTH_ID,
                  client_secret: import.meta.env.VITE_GOOGLE_AUTH_SECRET,
                  redirect_uri: "postmessage",
                  grant_type: "authorization_code"
                }
              );

              const accessToken = response.data.id_token;
              const { data } = await axios.post('http://localhost:8000/google-login', { accessToken: accessToken })
              useAuthStore().setUserData(data.access_token, data.username, response.data.access_token)
              await router.push({ name: 'home' })
            } catch (error) {
              console.error('Error logging in with Google:', error)
            }
        }
      })
      .requestCode()
  })
}
