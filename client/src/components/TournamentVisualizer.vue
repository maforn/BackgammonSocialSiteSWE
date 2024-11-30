<template>
    <div class="w-full flex flex-col items-center gap-4">
        <h2 class="text-center text-xl font-bold py-2 border-b-2 mb-4">
            You are already participating in tournament "{{ tournament?.name }}"
        </h2>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { fetchActiveTournament } from '@/services/tournamentService';
import { Tournament } from '@/models/Tournament';

export default defineComponent({
    name: 'TournamentVisualizer',
    data(){
		return {
			tournament: null as Tournament | null
		}
	},
    methods: {

    },
    async mounted() {
        this.tournament = await fetchActiveTournament();
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
</style>