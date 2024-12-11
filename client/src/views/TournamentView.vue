<template>
	<div class="tournament-view">
		<div class="bg"></div>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

		<div class="w-screen h-screen flex flex-col pt-20 items-center">

			<h1 class="text-center text-6xl font-black text-white">TOURNAMENT</h1>

			<div
				class="mt-10 flex items-center justify-center rounded-l-full rounded-r-full overflow-hidden bg-gray-400 text-white font-semibold">
				<button :class="['px-8 py-2 flex-1', showCreate ? 'bg-green-800' : '']" v-if="!hasCreatedTournament"
					@click="showCreatePanel">Create</button>
				<button :class="['px-8 py-2 flex-1', showJoin ? 'bg-green-800' : '']" v-if="!hasCreatedTournament"
					@click="showJoinPanel">Join</button>
				<button :class="['px-8 py-2 flex-1', showActive ? 'bg-green-800' : '']" v-if="hasCreatedTournament"
					@click="showActivePanel">Active</button>
				<button :class="['px-8 py-2 flex-1', showConcluded ? 'bg-green-800' : '']"
					@click="showConcludedPanel">Concluded</button>
			</div>

			<div
				class="flex flex-col mt-6 lg:w-1/2 md:w-3/4 sm:p-8 p-6 shadow-md items-center rounded-md gap-6 pl-3 py-2 text-sm md:text-lg bg-white">
				<TournamentVisualizer v-if="hasCreatedTournament && showActive" :tournament="activeTournament"/>
				<TournamentForm v-if="!hasCreatedTournament && showCreate" @created-tournament="updateTournament" />
				<TournamentLists v-if="!hasCreatedTournament && showJoin" @joined-tournament="updateTournament" />
				<div v-if="showConcluded" class="w-full flex flex-col justify-center items-center gap-y-2">
					<button v-if="concludedTournaments.length > 0" v-for="tournament,index in concludedTournaments" :key="index" 
					class="flex justify-center items-center w-5/6 px-3 py-2 bg-green-600 text-white rounded-r-full rounded-l-full hover:bg-green-700 shadow-md"
					@click="showTournamentResultPanel(tournament)">
						{{ tournament.name }}
				</button>
				<p v-else class="text-sm text-gray-500 italic text-center">No concluded tournament found.</p>
			</div>
			</div>
		</div>

		<div v-if="showTournamentResult" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-50">
			<div class="bg-white p-5 rounded-lg w-4/5 max-w-lg text-center relative">
				<button @click="hideTournamentResultPanel" class="absolute top-0 right-0 m-2 text-black x-receive-invites">
		<v-icon name="io-close-sharp" scale="1.5" />
	  </button>
				<TournamentVisualizer :tournament="selectedTournament" />
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
import router from '@/router';
import { checkCreatedTournamentExists, fetchActiveTournament, fetchConcludedTournaments } from '@/services/tournamentService';
import TournamentForm from '@/components/TournamentForm.vue';
import TournamentVisualizer from '@/components/TournamentVisualizer.vue';
import TournamentLists from '@/components/TournamentLists.vue';
import type { Tournament } from '@/models/Tournament';

export default defineComponent({
	name: 'TournamentView',
	components: {
		TournamentForm,
		TournamentVisualizer,
		TournamentLists
	},
	setup() {
		const hasCreatedTournament = ref(false)
		const activeTournament = ref(null)
		const concludedTournaments = ref([] as Array<Tournament>)

		checkCreatedTournamentExists().then(async exists => {
			hasCreatedTournament.value = exists
			if (exists) {
				activeTournament.value = await fetchActiveTournament()
			}
		})

		fetchConcludedTournaments().then(tournaments => {
			concludedTournaments.value = tournaments
		})

		return { hasCreatedTournament, activeTournament, concludedTournaments }
	},
	data() {
		return {
			showCreate: true,
			showJoin: false,
			showActive: true,
			showConcluded: false,
			showTournamentResult: false,
			selectedTournament: null
		}
	},
	methods: {
		async goHome() {
			await router.push({ name: 'home' });
		},
		async updateTournament(tournament: Tournament) {
			if (tournament){
				this.hasCreatedTournament = true;
				this.activeTournament = tournament;
				this.showActivePanel();	
			}
		},
		showCreatePanel() {
			this.showCreate = true;
			this.showJoin = false;
			this.showConcluded = false;
		},
		showJoinPanel() {
			this.showCreate = false;
			this.showJoin = true;
			this.showConcluded = false;
		},
		showActivePanel() {
			this.showActive = true;
			this.showConcluded = false;
		},
		showConcludedPanel() {
			this.showCreate = false;
			this.showJoin = false;
			this.showActive = false;
			this.showConcluded = true;
		},
		showTournamentResultPanel(tournament: Tournament) {
			this.selectedTournament = tournament;
			this.showTournamentResult = true;
		},
		hideTournamentResultPanel() {
			this.showTournamentResult = false;
		}
	},
	computed: {

	},

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
