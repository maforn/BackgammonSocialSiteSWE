import { defineStore } from 'pinia';

interface AuthState {
	token: string | null;
	username: string | null;
  google_token?: string | null;
}

export const useAuthStore = defineStore('auth', {
	state: (): AuthState => ({
		token: null,
		username: null,
    google_token: null,
	}),
	actions: {
		setUserData(token: string, username: string, google_token?: string) {
			this.token = token;
			this.username = username;
      this.google_token = google_token;
		},
		logout() {
			this.token = null;
			this.username = null;
		},
		isAuthenticated() {
			return !!this.token;
		},
	},
	persist: {
		storage: localStorage,
	},
});
