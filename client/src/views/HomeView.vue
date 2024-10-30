<template>
    <div class="w-screen h-screen flex flex-col pt-20 items-center">
        <h1 class="text-center text-6xl font-black">SOCIAL BACKGAMMON</h1>
        <div class="flex flex-col mt-20 w-4/5 sm:w-3/5 md:w-2/5 gap-3 text-lg">
            <router-link to="/human" class="flex justify-end items-center pl-3 py-2 bg-gray-600 text-white rounded-r-full rounded-l-full hover:bg-gray-700 shadow-md">
                <div class="circle flex items-center justify-center rounded-full">
                    <v-icon name="io-person" class="text-black" scale="1.5"/>
                </div>
                <div class="w-full h-full flex justify-center items-center pr-8 uppercase font-medium">
                    Play human
                </div>
            </router-link>
            <router-link to="/" class="flex justify-end items-center pl-3 py-2 bg-gray-600 text-white rounded-r-full rounded-l-full hover:bg-gray-700 shadow-md">
                <div class="circle flex items-center justify-center rounded-full">
                    <v-icon name="fa-robot" class="text-black" scale="2"/>
                </div>
                <div class="w-full h-full flex justify-center items-center pr-8 uppercase font-medium">
                    Play AI
                </div>
            </router-link>
            <router-link to="/" class="flex justify-end items-center pl-3 py-2 bg-gray-600 text-white rounded-r-full rounded-l-full hover:bg-gray-700 shadow-md">
                <div class="circle flex items-center justify-center rounded-full">
                    <v-icon name="io-people" class="text-black" scale="1.5"/>
                </div>
                <div class="w-full h-full flex justify-center items-center pr-8 uppercase font-medium">
                    Tournament
                </div>
            </router-link>
            <router-link to="/" class="flex justify-end items-center pl-3 py-2 bg-gray-600 text-white rounded-r-full rounded-l-full hover:bg-gray-700 shadow-md">
                <div class="circle flex items-center justify-center rounded-full">
                    <v-icon name="io-stats-chart" class="text-black" scale="1.5"/>
                </div>
                <div class="w-full h-full flex justify-center items-center pr-8 uppercase font-medium">
                    Leaderboards
                </div>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'HomeView',

    mounted() {
        console.log('HomeView mounted');
    }
});
</script>

<style scoped>
.circle {
    width: 3rem; /* 48px */
    aspect-ratio: 1;
    background-color: white;
    border-radius: 50%;
}

</style>