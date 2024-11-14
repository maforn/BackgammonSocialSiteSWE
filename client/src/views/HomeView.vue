<template>
  <div class="w-screen h-screen flex flex-col pt-20 content-center items-center lg:pl-5">
    <div class="bg"></div>
    <div class="flex justify-center">
      <h1 class="text-center mt-3 text-5xl sm:text-6xl lg:text-left text-white font-black">SOCIAL BACKGAMMON</h1>
    </div>
    <div class="flex flex-col mt-20 w-4/5 sm:w-3/5 lg:w-2/5 gap-4 text-lg content-center">

      <router-link :to="hasSuspendedGame ? '/game' : '/human'"
        class="flex justify-end items-center pl-3 py-2 bg-white text-black rounded-r-full rounded-l-full hover:bg-gray-300 shadow-md">
        <div class="circle flex items-center justify-center rounded-full">
          <v-icon v-if="hasSuspendedGame" name="io-hourglass-sharp" class="text-white" scale="1.5" />
          <v-icon v-else name="io-person" class="text-white" scale="1.5" />
        </div>
        <div class="w-full h-full flex justify-center items-center pr-8 uppercase font-medium">
          {{ hasSuspendedGame ? "RESUME MATCH" : "PLAY HUMAN" }}
        </div>
      </router-link>
      <router-link v-if="!hasSuspendedGame" to="/ai"
        class="flex justify-end items-center pl-3 py-2 bg-white text-black rounded-r-full rounded-l-full hover:bg-gray-300 shadow-md">
        <div class="circle flex items-center justify-center rounded-full">
          <v-icon name="fa-robot" class="text-white" scale="1.5" />
        </div>
        <div class="w-full h-full flex justify-center items-center pr-8 uppercase font-medium">
          PLAY AI
        </div>
      </router-link>
      <router-link to="/"
        class="flex justify-end items-center pl-3 py-2 bg-white text-black rounded-r-full rounded-l-full hover:bg-gray-300 shadow-md">
        <div class="circle flex items-center justify-center rounded-full">
          <v-icon name="io-trophy-sharp" class="text-white" scale="1.5" />
        </div>
        <div class="w-full h-full flex justify-center items-center pr-8 uppercase font-medium">
          TOURNAMENT
        </div>
      </router-link>
      <router-link to="/"
        class="flex justify-end items-center pl-3 py-2 bg-white text-black rounded-r-full rounded-l-full hover:bg-gray-300 shadow-md">
        <div class="circle flex items-center justify-center rounded-full">
          <v-icon name="io-stats-chart" class="text-white" scale="1.5" />
        </div>
        <div class="w-full h-full flex justify-center items-center pr-8 uppercase font-medium">
          LEADERBOARDS
        </div>
      </router-link>
      <button id="show-invites-btn" to="/" @click.prevent="showInvites"
        class="flex justify-end items-center pl-3 py-2 bg-white text-black rounded-r-full rounded-l-full hover:bg-gray-300 shadow-md">
        <div class="circle flex items-center justify-center rounded-full">
          <v-icon name="io-mail-sharp" class="text-white" scale="1.5" />
        </div>
        <div class="w-full h-full flex justify-center items-center pr-8 uppercase font-medium">
          RECEIVE INVITES
        </div>
      </button>
    </div>

    <div v-if="showOverlay" class="overlay">
      <div class="overlay-content relative">
        <button @click="closeOverlay" class="absolute top-0 right-0 m-2 text-black x-receive-invites">
          <v-icon name="io-close-sharp" scale="1.5" />
        </button>
        <h2 class="font-black mb-1 text-lg">PENDING INVITES</h2>
        <p v-if="invites?.length == 0" class="text-sm text-gray-500 italic">No invites.</p>
        <ul v-else class="max-h-[80vh] overflow-auto">
          <li v-for="(invite, index) in invites" :key="index" class="flex flex-col justify-center items-center">
            <button @click="acceptInvite(index)"
              class="flex justify-center items-center pl-3 pe-3 py-2 mt-1 mb-1 w-3/5 bg-gray-400 text-white rounded-r-full rounded-l-full hover:bg-gray-700 shadow-md">
              Invite from&nbsp;<p class="font-black">{{ invite.player1 }}</p>
              <span
                class="bg-indigo-100 ms-2 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">First
                to {{ invite.first_to }} </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div class="fixed top-0 left-2 p-4 flex justify-start">
      <v-icon name="fa-user-circle" class="text-white" scale="3" />
      <div class="flex flex-col justify-evenly ms-2">
        <div class="text-lg text-white font-bold text-left">{{ username }}</div>
        <div id="logout" @click="logout" class="text-sm text-left text-white hover:underline hover:cursor-pointer">
          Logout</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { logout as authLogout } from '@/services/authService'
import { acceptInviteService, receiveInviteService } from '@/services/invitesService'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore';
import axiosInstance from '@/axios';

interface Invite {
	_id: string;
	player1: string;
	first_to: number;
}

export default defineComponent({
  name: 'HomeView',
  setup() {
    const router = useRouter()

    const username = ref('')
    const showOverlay = ref(false)
    const invites = ref<Invite[]>([]);
    const hasSuspendedGame = ref(true)

    onMounted(async () => {
      username.value = await axiosInstance.get('/users/me').then(res => res.data.username)
    })

    useGameStore()
      .checkSuspendedGameExists()
      .then((exists) => {
        hasSuspendedGame.value = exists
      });

		const logout = () => {
			authLogout();
			router?.push('register');
		};

    const receiveInvites = async () => {
      try {
        const invites = await receiveInviteService()
        return invites
      } catch (error) {
        console.error('Error in receiveInvites:', error)
      }
    }

    const showInvites = async () => {
      invites.value = await receiveInvites()
      showOverlay.value = true
    }

    const acceptInvite = async (index: number) => {
      const invite_id = invites.value[index]._id
      try {
        await acceptInviteService(invite_id)
        router.push({ name: 'game' })
      } catch (error) {
        console.error('Error in acceptInvite:', error)
      } finally {
        showOverlay.value = false
      }
    }

		const closeOverlay = () => {
			showOverlay.value = false;
		};

    return { logout, receiveInvites, showInvites, closeOverlay, showOverlay, invites, acceptInvite, username, hasSuspendedGame }
  }
})
</script>

<style scoped>
.bg {
	/* Photo credit: FIGIST CO on Unsplash */
	background-image: url('../assets/bg.jpg');
	position: fixed;
	width: 100vw;
	height: 100vh;
	top: 0;
	left: 0;
	margin: 0;
	padding: 0;
	z-index: -1;
	overflow: hidden;
	filter: brightness(50%);
	transform: scaleX(-1);
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}

.circle {
  width: 3rem;
  /* 48px */
  aspect-ratio: 1;
  background-color: black;
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
	position: relative;
}

.x-receive-invites:hover {
	transform: scale(1.3);
}
</style>
