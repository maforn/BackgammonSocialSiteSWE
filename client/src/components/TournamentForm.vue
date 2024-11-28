<template>
    <form class="w-full flex flex-col items-center gap-4" @submit="createTournament">
        <input type="text" placeholder="Tournament Name" required v-model="tournamentName"
            class="text-center text-xl font-bold py-2 border-b-2 mb-4">

        <div class="flex justify-center items-center gap-2">
            <input type="checkbox" class="size-5" v-model="openToEveryone">
            Open to everyone
        </div>

        <button id="create-btn" type="submit" v-if="allowCreation" @click=""
            class="mt-8 px-4 py-2 w-2/3 rounded-xl">Create Tournament
        </button>
    </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createTournament } from '@/services/tournamentService';

export default defineComponent({
    name: 'TournamentForm',
    emits: ['createdTournament'],
    data(){
		return {
			tournamentName: '',
			openToEveryone: false,
			roundsTowWin: 1,
			participants: []
		}
	},
    methods: {
        async createTournament(event: Event){
			event.preventDefault();
			const tournament = await createTournament(this.tournamentName, this.openToEveryone, this.participants, this.roundsTowWin);
            this.$emit('createdTournament', tournament);
		}
    },
    computed: {
		allowCreation(){
			return this.openToEveryone;
		},
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