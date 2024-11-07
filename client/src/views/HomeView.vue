<template>
  <div class="w-screen h-screen flex flex-col pt-20 items-center">
    <h1 class="text-center text-6xl font-black">SOCIAL BACKGAMMON</h1>
    <div class="flex flex-col mt-20 w-4/5 sm:w-3/5 md:w-2/5 gap-3 text-lg">
      <!--TEMPORARY-->
      <button
        @click="logout"
        class="flex justify-end items-center pl-3 py-2 bg-gray-600 text-white rounded-r-full rounded-l-full hover:bg-gray-700 shadow-md"
      >
        <div class="circle flex items-center justify-center rounded-full">
          <v-icon name="io-person" class="text-black" scale="1.5" />
        </div>
        <div class="w-full h-full flex justify-center items-center pr-8 uppercase font-medium">Logout</div>
      </button>
      <!---->

      <router-link to="/human"
                   class="flex justify-end items-center pl-3 py-2 bg-gray-600 text-white rounded-r-full rounded-l-full hover:bg-gray-700 shadow-md">
        <div class="circle flex items-center justify-center rounded-full">
          <v-icon name="io-person" class="text-black" scale="1.5" />
        </div>
        <div class="w-full h-full flex justify-center items-center pr-8 uppercase font-medium">
          Play human
        </div>
      </router-link>
      <router-link to="/game"
                   class="flex justify-end items-center pl-3 py-2 bg-gray-600 text-white rounded-r-full rounded-l-full hover:bg-gray-700 shadow-md">
        <div class="circle flex items-center justify-center rounded-full">
          <v-icon name="fa-robot" class="text-black" scale="2" />
        </div>
        <div class="w-full h-full flex justify-center items-center pr-8 uppercase font-medium">
          Play AI
        </div>
      </router-link>
      <router-link to="/"
                   class="flex justify-end items-center pl-3 py-2 bg-gray-600 text-white rounded-r-full rounded-l-full hover:bg-gray-700 shadow-md">
        <div class="circle flex items-center justify-center rounded-full">
          <v-icon name="io-people" class="text-black" scale="1.5" />
        </div>
        <div class="w-full h-full flex justify-center items-center pr-8 uppercase font-medium">
          Tournament
        </div>
      </router-link>
      <router-link to="/"
                   class="flex justify-end items-center pl-3 py-2 bg-gray-600 text-white rounded-r-full rounded-l-full hover:bg-gray-700 shadow-md">
        <div class="circle flex items-center justify-center rounded-full">
          <v-icon name="io-stats-chart" class="text-black" scale="1.5" />
        </div>
        <div class="w-full h-full flex justify-center items-center pr-8 uppercase font-medium">
          Leaderboards
        </div>
      </router-link>
      <button to="/" @click.prevent="showInvites"
              class="flex justify-end items-center pl-3 py-2 bg-gray-600 text-white rounded-r-full rounded-l-full hover:bg-gray-700 shadow-md">
        <div class="w-full h-full flex justify-center items-center pr-8 uppercase font-medium">
          Receive invites
        </div>
      </button>
    </div>

    <div v-if="showOverlay" class="overlay">
      <div class="overlay-content">
        <h2>Pending Invites</h2>
        <ul class="max-h-[80vh] overflow-auto">
          <li v-for="(invite,index) in invites" :key="index" class="flex flex-column justify-center">
            <button @click="acceptInvite(index)"
                    class="flex justify-end items-center pl-3 pe-3 py-2 bg-gray-600 text-white rounded-r-full rounded-l-full hover:bg-gray-700 shadow-md">
              {{ invite.player1 }}
            </button>
          </li>
        </ul>
        <button @click="closeOverlay">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { logout as authLogout } from '@/services/authService'
import { acceptInviteService, receiveInviteService as receiveInvites } from '@/services/invitesService'
import { useRouter } from 'vue-router'

interface Invite {
  _id: string;
  player1: string;
}

export default defineComponent({
  name: 'HomeView',
  setup() {
    const router = useRouter()
    const showOverlay = ref(false)

    const invites = ref<Invite[]>([])

    const logout = () => {
      authLogout()
      router.push('register')
    }
    const debugReceiveInvites = async () => {
      try {
        const invites = await receiveInvites()
        return invites
      } catch (error) {
        console.error('Error in debugReceiveInvites:', error)
      }
    }

    const showInvites = async () => {
      invites.value = await debugReceiveInvites()
      showOverlay.value = true
    }

    const acceptInvite = async (index: number) => {
      const invite_id = invites.value[index]._id
      try {
        await acceptInviteService(invite_id)
        console.log('Accepted invite.')
      } catch (error) {
        console.error('Error in acceptInvite:', error)
      } finally {
        showOverlay.value = false
      }
    }

    const closeOverlay = () => {
      showOverlay.value = false
    }

    return { logout, debugReceiveInvites, showInvites, closeOverlay, showOverlay, invites, acceptInvite }
  }
})
</script>

<style scoped>
.circle {
  width: 3rem; /* 48px */
  aspect-ratio: 1;
  background-color: white;
  border-radius: 50%;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  text-align: center;
}
</style>
