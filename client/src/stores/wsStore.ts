import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { wsService } from '@/services/wsService'

interface WsState {
  socket: WebSocket | null;
  errors: {id: number, message: string}[];
}

export const useWsStore = defineStore('ws', {
  state: (): WsState => ({
    socket: null,
    errors: []
  }),
  actions: {
    connect() {
      const authStore = useAuthStore()
      if (authStore.token) {
        console.log('Connecting to ws://localhost:8000/ws')
        wsService.connect()
        this.socket = wsService.socket
      }
    },
    disconnect() {
      wsService.disconnect()
      this.socket = null
    },
    sendMessage(type: string, message: string) {
      wsService.sendMessage(type, message)
    },
    addError(message: string) {
      const id = Date.now()
      this.errors.push({ id: id, message })
      setTimeout(() => this.removeError(id), 5000)
    },
    removeError(id: number) {
      this.errors = this.errors.filter((error) => error.id !== id)
    }
  }
})
