<template>
	<div class="tournament-view">
		<div class="bg"></div>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

		<div class="w-screen h-screen flex flex-col pt-20 items-center">

			<h1 class="text-center text-6xl font-black text-white">TOURNAMENT</h1>

			<div
				class="mt-10 flex items-center justify-center rounded-l-full rounded-r-full overflow-hidden bg-gray-400 text-white font-semibold">
				<button :class="['px-8 py-2 flex-1', showCreate ? 'bg-green-800' : '']" v-if="!hasCreatedTournament"
					@click="showCreate = true">Create</button>
				<button :class="['px-8 py-2 flex-1', !showCreate ? 'bg-green-800' : '']" v-if="!hasCreatedTournament"
					@click="showCreate = false">Join</button>
				<button :class="['px-8 py-2 flex-1', 'bg-green-800']" v-if="hasCreatedTournament"
					@click="">Active</button>
			</div>

			<div
				class="flex flex-col mt-6 w-1/2 sm:p-8 p-6 shadow-md items-center rounded-md gap-6 pl-3 py-2 text-sm md:text-lg bg-white">
				<TournamentForm v-if="!hasCreatedTournament && showCreate" @created-tournament="updateTournament" />
				<TournamentVisualizer v-if="hasCreatedTournament" />
				<button @click="getAvailableTournaments">Get available (console log)</button>
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
import { checkCreatedTournamentExists } from '@/services/tournamentService';
import TournamentForm from '@/components/TournamentForm.vue';
import TournamentVisualizer from '@/components/TournamentVisualizer.vue';
import type { Tournament } from '@/models/Tournament';
import { useWsStore } from '@/stores/wsStore';
import { isAxiosError } from 'axios'
import axiosInstance from '@/axios';

export default defineComponent({
	name: 'TournamentView',
	components: {
		TournamentForm,
		TournamentVisualizer
	},
	setup() {
		const hasCreatedTournament = ref(false)
		checkCreatedTournamentExists().then(exists => {
			hasCreatedTournament.value = exists
		})
		return { hasCreatedTournament }
	},
	data() {
		return {
			showCreate: true,
			activeTournament: null as Tournament | null,
		}
	},
	methods: {
		async goHome() {
			await router.push({ name: 'home' });
		},
		async updateTournament(tournament: Tournament) {
			if (tournament)
				this.hasCreatedTournament = true;
		},
		async getAvailableTournaments() {
			const wsStore = useWsStore();
			try{
				const response = await axiosInstance.get('/tournaments/available');
				console.log(response.data);
			} catch (error){
				if (isAxiosError(error)) {
					wsStore.addError(error?.response?.data?.detail)
				} 
			}
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
