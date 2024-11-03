import { defineStore } from 'pinia'

interface AuthState {
  token: string | null;
  username: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    username: null
  }),
  actions: {
    setUserData(token: string, username: string) {
      this.token = token
      this.username = username
    },
    logout() {
      this.token = null
      this.username = null
    },
    isAuthenticated() {
      return !!this.token
    }
  },
  persist: {
    storage: localStorage
  }
})
