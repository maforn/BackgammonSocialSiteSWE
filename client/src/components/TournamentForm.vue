<template>
    <form class="w-full flex flex-col items-center gap-4" @submit="createTournament">
        <input type="text" placeholder="Tournament Name" required v-model="tournamentName"
            class="text-center text-xl font-bold py-2 border-b-2 mb-4">
		
		<div class="flex justify-center items-center pl-3 py-2 gap-x-2 self-center">
			<label for="roundsToWin" class="text-right">Rounds to win</label>
			<div class="container">
				<div class="select">
					<select name="roundsToWin" id="roundsToWin" v-model="roundsToWin">
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
					</select>
				</div>
			</div>
		</div>

        <div class="flex justify-center items-center gap-2">
            <input name="open" id="open" type="checkbox" class="size-5" v-model="openToEveryone" @click="`participants = [${username}]`">
            <label for="open">Open to everyone</label>
        </div>

		<div id="user-search" v-if="!openToEveryone"
			class="relative mt-3 flex justify-center items-center pl-3 pe-3 py-2 bg-gray-900 text-white rounded-r-full rounded-l-full shadow-sm">
			<input v-model="searchQuery" @input="onInput" class="flex-grow pl-3 py-2 outline-none bg-gray-900 text-white"
			  placeholder="Add participant..." :disabled="participants.length >= 4"/>
			<i class="fas fa-search text-white pr-3"></i>
			<ul v-if="showDropdown"
			  class="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 z-10">
			  <li v-for="user in filteredUsers" :key="user.username"
				class="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black" @click="selectUser(user)">
				{{ user.username }}
			  </li>
			</ul>
		</div>

		<div v-if="!openToEveryone && participants.length > 1" class="flex flex-col gap-2">
			<p>Participants:</p>
			<ul>
				<li v-for="participant in participants" :key="participant">{{ participant }}</li>
			</ul>
		</div>

        <button id="create-btn" type="submit" :disabled="!allowCreation" @click=""
            class="mt-8 px-4 py-2 w-2/3 rounded-xl">Create Tournament
        </button>
    </form>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { createTournament } from '@/services/tournamentService';
import { debounce } from 'lodash'
import { useAuthStore } from '@/stores/authStore';
import axiosInstance from '@/axios'

export default defineComponent({
    name: 'TournamentForm',
    emits: ['createdTournament'],
	setup(){
		const username = useAuthStore().username;
		const participants = ref([] as string[])
		onMounted(async () => {
			participants.value.push(username)
		})
		return { username, participants }
	},
    data(){
		return {
			searchQuery: '',
			users: [] as Array<{ id: number; username: string }>,
			showDropdown: false,
			hasSelectedOpponent: false,
			tournamentName: '',
			openToEveryone: false,
			roundsToWin: 1
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
        async createTournament(event: Event){
			event.preventDefault();
			const tournament = await createTournament(this.tournamentName, this.openToEveryone, this.participants, this.roundsToWin);
            this.$emit('createdTournament', tournament);
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
				this.showDropdown = this.filteredUsers.length > 0
			} catch (error) {
				console.error('Error fetching users:', error)
				this.users = []
			}
		},
		selectUser(user: { username: string }) {
			this.participants.push(user.username)
			this.searchQuery = ''
			this.showDropdown = false
			this.hasSelectedOpponent = true
		},
    },
    computed: {
		allowCreation(){
			return this.openToEveryone || this.participants.length == 4;
		},
		filteredUsers() {
			// Filter out unfitting usernames and current user and any participants already selected
			return this.users.filter(u =>
				u.username.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
				!(this.participants.some(p => p.toLowerCase() === u.username.toLowerCase()))
			)
		}
	},
});
</script>

<style scoped>
#create-btn:disabled {
	background-color: #14532d;
	color: gray;
	cursor: not-allowed;
}

#create-btn {
	background-color: #16a34a;
	color: white;
}

#create-btn:not(:disabled):hover {
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

#user-search input:disabled{
	cursor: not-allowed;
	opacity: 0.5;
}
</style>