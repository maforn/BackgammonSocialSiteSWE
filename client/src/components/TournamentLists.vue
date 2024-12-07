<template>
<div class="flex justify-evenly w-full h-full">
    <div class="w-1/2 flex flex-col justify-start items-center">
        <h3 class="text-center text-xl font-black text-black mb-3">OPEN</h3>
		<p v-if="openTournaments?.length == 0" class="text-sm text-gray-500 italic text-center">No open tournaments available.</p>
        <button v-for="tournament,index in openTournaments" :key="index" 
		class="flex justify-center items-center w-5/6 px-3 py-2 mb-2 bg-green-600 text-white rounded-r-full rounded-l-full hover:bg-green-700 shadow-md"
		@click="selectTournament(tournament)">
            {{ tournament.name }}
		</button>
    </div>
        
    <div class="w-1/2 flex flex-col justify-start items-center">
        <h3 class="text-center text-xl font-black text-black mb-3">CLOSED</h3>
		<p v-if="closedTournaments?.length == 0" class="text-sm text-gray-500 italic text-center">No closed tournaments available.</p>
        <button v-for="tournament,index in closedTournaments" :key="index" 
		class="flex justify-center items-center w-5/6 px-3 py-2 mb-2 bg-green-600 text-white rounded-r-full rounded-l-full hover:bg-green-700 shadow-md"
		@click="selectTournament(tournament)">
            {{ tournament.name }}
		</button>
    </div>
</div>

<div v-if="showOverlay" class="overlay">
	<div class="overlay-content relative">
	  <button @click="closeOverlay" class="absolute top-0 right-0 m-2 text-black x-receive-invites">
		<v-icon name="io-close-sharp" scale="1.5" />
	  </button>
	  <div class="flex flex-col gap-y-1 justify-around items-center">
		<h2 class="font-black mb-1 text-lg">{{selectedTournament.name}}</h2>
		<p>Created by: {{selectedTournament.owner}}</p>
		<p>{{selectedTournament.open ? "Participants" : "Invited"}}: {{ selectedTournament.participants.join(", ") }}</p>
		<p v-if="!selectedTournament.open">Confimed participants: {{ selectedTournament.confirmed_participants.join(", ")}} </p>
		<p>Rounds to win: {{ selectedTournament.rounds_to_win }} </p>
		<button class="flex justify-center items-center px-4 py-2 mt-3 mb-2 bg-green-600 text-white rounded-r-full rounded-l-full hover:bg-green-700 shadow-md"
		@click="joinTournament(selectedTournament.owner, selectedTournament.name)">{{ selectedTournament.open ? "Request participation" : "Confirm participation" }}</button>
	</div>
	</div>
  </div>
    
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axiosInstance from '@/axios'
import { Tournament } from '@/models/Tournament';
import { useWsStore } from '@/stores/wsStore';
import { isAxiosError } from 'axios'

export default defineComponent({
    name: 'TournamentLists',
    emits: ['joinedTournament'],
	setup(_, { emit }){
		const openTournaments = ref([] as Array<Tournament>)
		const closedTournaments = ref([] as Array<Tournament>)
		const showOverlay = ref(false)
		const selectedTournament = ref(null as Tournament | null)

		const getAvailableTournaments = async () => {
			const wsStore = useWsStore();
			try{
				const response = await axiosInstance.get('/tournaments/available');
				openTournaments.value = response.data?.filter((tournament: Tournament) => tournament.open)
                closedTournaments.value = response.data?.filter((tournament: Tournament) => !tournament.open)
			} catch (error){
				if (isAxiosError(error)) {
					wsStore.addError(error?.response?.data?.detail)
				} 
			}
		};

		onMounted(async () => {
			await getAvailableTournaments()
		});

		const closeOverlay = () => {
			showOverlay.value = false;
		};

		const selectTournament = (tournament: Tournament) => {
			selectedTournament.value = tournament;
			showOverlay.value = true;
		};

		const joinTournament = async (owner: string, name: string) => {
			const wsStore = useWsStore();
			try{
				const response = await axiosInstance.post('/tournaments/join', { owner, name });
				wsStore.addNotification("Joined")
				emit('joinedTournament', response.data.tournament)
			} catch (error){
				if (isAxiosError(error)) {
					wsStore.addError(error?.response?.data?.detail)
				} 
			}
		};

		return { openTournaments, closedTournaments, showOverlay, selectedTournament, getAvailableTournaments, closeOverlay, selectTournament, joinTournament }
	},
	data(){
		return {
		}
	},
	computed: {
		
	},
});
</script>

<style scoped>
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