<template>
<div class="flex justify-evenly w-full h-full">
    <div class="w-1/2 flex flex-col justify-evenly items-center">
        <h3 class="text-center text-xl font-black text-black">OPEN</h3>
        <div v-for="tournament,index in openTournaments" :key="index">
            <p>{{tournament.name}}</p>
        </div>
    </div>
        
    <div class="w-1/2 flex flex-col justify-evenly items-center">
        <h3 class="text-center text-xl font-black text-black">CLOSED</h3>
        <div v-for="tournament,index in closedTournaments" :key="index">
            <p>{{tournament.name}}</p>
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
	setup(){
		const openTournaments = ref([] as Array<Tournament>)
		const closedTournaments = ref([] as Array<Tournament>)
		const getAvailableTournaments = async () => {
			const wsStore = useWsStore();
			try{
				const response = await axiosInstance.get('/tournaments/available');
				openTournaments.value = response.data?.filter((tournament: Tournament) => tournament.open)
                closedTournaments.value = response.data?.filter((tournament: Tournament) => !tournament.open)
                console.log("openTournaments: ", openTournaments.value)
                console.log("closedTournaments: ", closedTournaments.value)
			} catch (error){
				if (isAxiosError(error)) {
					wsStore.addError(error?.response?.data?.detail)
				} 
			}
		}
		onMounted(async () => {
			await getAvailableTournaments()
		})
		return { openTournaments, closedTournaments, getAvailableTournaments }
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

</style>