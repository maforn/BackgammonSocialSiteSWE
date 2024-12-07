<template>
    <div class="w-full flex flex-col items-center gap-4">
        <h2 class="text-center text-xl font-bold py-2 border-b-2 mb-4">
            {{ tournament?.name }}
        </h2>
        <p v-if="tournament?.status=='pending'" class="text-sm text-gray-500 italic text-center">
            The tournament has not started yet. Please, wait for the other participants to join.
        </p>
        <div v-else>
            <div v-if="tournament?.type=='round_robin'">
                <table class="w-full text-center shadow-md">
                    <caption class="sr-only">Tournament Statistics</caption>
                    <thead class="border-2 bg-gray-100">
                        <tr class="text-gray-700">
                            <th class="py-2 px-4">Username</th>
                            <th class="py-2 px-4">Wins</th>
                            <th class="py-2 px-4">Losses</th>
                            <th class="py-2 px-4">Matches</th>
                            <th class="py-2 px-4">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="stat in sortedStats" :key="stat.username">
                            <td class="border px-4 py-2">{{ stat.username }}</td>
                            <td class="border px-4 py-2">{{ stat.wins }}</td>
                            <td class="border px-4 py-2">{{ stat.losses }}</td>
                            <td class="border px-4 py-2">{{ stat.matches }}</td>
                            <td class="border px-4 py-2">{{ stat.points }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Tournament } from '@/models/Tournament';

export default defineComponent({
    name: 'TournamentVisualizer',
    data(){

	},
    props: {
        tournament: {
            type: Object as () => Tournament,
            required: true,
            default: null
        }
    },
    methods: {

    },
    computed: {
        sortedStats() {
            return this.tournament?.stats.sort((a, b) => {
                if (b.wins === a.wins) {
                    return b.points - a.points;
                }
                return b.wins - a.wins;
            });
        }
    }
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