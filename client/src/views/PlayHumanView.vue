<template>
	<div class="play-human-view">
	  <div class="bg"></div>
	  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

	  <div class="w-screen h-screen flex flex-col pt-20 items-center">

		<h1 class="text-center text-6xl font-black text-white">PLAY HUMAN</h1>

		<div
		  class="flex flex-col mt-20 w-1/2 sm:p-8 p-6 shadow-md rounded-md gap-3 pl-3 py-2 text-sm md:text-lg bg-white">
		  <button id="random-btn" :disabled="hasSuspendedGame"
		  	@click="sendRandomInvite"
			class="flex justify-center items-center pl-3 py-2 bg-green-600 text-white rounded-r-full rounded-l-full hover:bg-green-700 shadow-md">
			RANDOM OPPONENT
		  </button>

		  <div class="flex justify-evenly items-center pl-3 py-2">
			<hr style="border-color: black;">
			<span class="text-black text-sm">OR</span>
			<hr style="border-color: black;">
		  </div>

		  <div
			class="relative flex justify-center items-center pl-3 pe-3 py-2 bg-gray-900 text-white rounded-r-full rounded-l-full shadow-sm">
			<input v-model="searchQuery" @input="onInput" class="flex-grow pl-3 py-2 outline-none bg-gray-900 text-white"
			  placeholder="Search by username..." />
			<i class="fas fa-search text-white pr-3"></i>
			<ul v-if="showDropdown"
			  class="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 z-10">
			  <li v-for="user in filteredUsers" :key="user.username"
				class="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black" @click="selectUser(user)">
				{{ user.username }}
			  </li>
			</ul>
		  </div>

		  <div class="flex justify-center items-center pl-3 py-2 gap-x-2 self-center">
			<label for="rounds_to_win" class="text-right">Rounds to win</label>
			<div class="container">
			  <div class="select">
				<select name="rounds_to_win" id="rounds_to_win" v-model="rounds_to_win">
				  <option value="1">1</option>
				  <option value="2">2</option>
				  <option value="3">3</option>
				</select>
			  </div>
			</div>
		  </div>

		  <div class="flex justify-center">
			<button id="invite-btn" :disabled="!hasSelectedOpponent || hasSuspendedGame" @click="sendInvite"
			  class="mt-2 px-4 py-2 w-2/3 rounded-xl">Invite
			</button>
		  </div>
		</div>
	  </div>

	  <button @click="goHome"
		class="absolute top-4 left-4 px-4 py-2 bg-white text-black rounded-md hover:bg-gray-400"><v-icon
		  name="io-home-sharp" />
	  </button>
	</div>
  </template>


<script lang="ts">
import { defineComponent, ref } from 'vue'
import { debounce } from 'lodash'
import {
  sendInviteService,
  getRandomOpponentService,
  getGoogleContactsEmails
} from '@/services/invitesService'
import { useGameStore } from '@/stores/gameStore';
import axiosInstance from '@/axios'
import router from '@/router';

export default defineComponent({
	name: 'PlayHumanView',
	setup() {
		const hasSuspendedGame = ref(true)
		const hasSelectedOpponent = ref(false)

    getGoogleContactsEmails().then((emails) => {
      console.log(emails)
    })

		useGameStore()
			.checkSuspendedGameExists()
			.then((exists) => {
				hasSuspendedGame.value = exists
			});

		return { hasSuspendedGame, hasSelectedOpponent }
	},
	data(): {
		searchQuery: string;
		users: Array<{ id: number; username: string }>;
		showDropdown: boolean;
		hasSelectedOpponent: boolean,
		rounds_to_win: number,
		hasSuspendedGame: boolean,
	} {
		return {
			searchQuery: '',
			users: [] as Array<{ id: number; username: string }>,
			showDropdown: false,
			hasSelectedOpponent: false,
			rounds_to_win: 1,
			hasSuspendedGame: true
		}
	},
	computed: {
		filteredUsers() {
			return this.users.filter(u =>
				u.username.toLowerCase().includes(this.searchQuery.toLowerCase())
			)
		}
	},
	methods: {
		onInput: debounce(function (this: {
			searchQuery: string;
			fetchUsers: () => void;
			showDropdown: boolean;
			hasSelectedOpponent: boolean
		}) {
			this.hasSelectedOpponent = false
			if (this.searchQuery.length >= 2) {
				this.fetchUsers()
			} else {
				this.showDropdown = false
			}
		}, 300),
		async goHome() {
			await router.push({ name: 'home' });
		},
		async fetchUsers() {
			try {
				const response = await axiosInstance.get('/users/search', {
					params: { query: this.searchQuery }
				})
				if (Array.isArray(response.data)) {
					this.users = response.data.map(u => ({ id: u.id, username: u.username })) // Ensure each item is an object with id and username properties
				} else {
					this.users = []
				}
				this.showDropdown = this.users.length > 0
			} catch (error) {
				console.error('Error fetching users:', error)
				this.users = []
			}
		},
		selectUser(user: { username: string }) {
			this.searchQuery = user.username
			this.showDropdown = false
			this.hasSelectedOpponent = true
		},
		async sendInvite() {
			try {
				await sendInviteService(this.searchQuery, this.rounds_to_win)
				this.searchQuery = ''
				this.hasSelectedOpponent = false
			} catch (error) {
				console.error('Error sending invite:', error)
			}
		},
		async sendRandomInvite() {
			try{
				const opponent_username = await getRandomOpponentService()
				if(!opponent_username) {
					return
				}
				await sendInviteService(opponent_username, this.rounds_to_win)
			} catch (error) {
				console.error('Error sending random invite:', error)
			}
		}
	},
	watch: {
		searchQuery() {
			if (this.searchQuery.length < 2) {
				this.showDropdown = false
			}
		}
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

hr {
	width: 30%;
	height: 1px;
	border-color: white;
}

#invite-btn:disabled, #random-btn:disabled {
	background-color: #14532d;
	color: gray;
	cursor: not-allowed;
}

#invite-btn {
	background-color: #16a34a;
	color: white;
}

#invite-btn:not(:disabled):hover,
#random-btn:not(:disabled):hover {
	background-color: #15803d;
}

select {
	appearance: none;
	outline: 10px red;
	border: 0;
	box-shadow: none;
	flex: 1;
	padding: 0 1em;
	color: #fff;
	background-color: #2c3e50;
	background-image: none;
	cursor: pointer;
}

.select {
	position: relative;
	display: flex;
	width: 7em;
	height: 3em;
	border-radius: .25em;
	overflow: hidden;
}

/* Arrow */
.select::after {
	content: '\25BC';
	position: absolute;
	top: 0;
	right: 0;
	padding: 1em;
	background-color: #34495e;
	transition: .25s all ease;
	pointer-events: none;
}

.select:hover::after {
	color: #16a34a;
}
</style>
