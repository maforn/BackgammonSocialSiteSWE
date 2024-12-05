<template>
    <div class="user-stats-view">
      <div class="bg"></div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  
      <div class="w-screen h-screen flex flex-col pt-20 items-center">
  
        <h1 class="text-center text-6xl font-black text-white">YOUR STATS</h1>
  
        <div v-if="myData"
             class="flex flex-col mt-20 w-5/6 sm:p-8 p-6 shadow-md rounded-md gap-3 pl-3 py-2 text-sm md:text-lg bg-white items-center">
            <h3 class="text-center text-3xl font-black text-black underline">{{myData.username}}</h3>
            
            <div class="flex justify-center w-1/6">
                <pie-chart
                :percent="myData.stats.matches_won / myData.stats.matches_played * 100"
                :stroke-width=3
                :label="`${myData.stats.matches_won / myData.stats.matches_played * 100}%`"
                label-small="Win rate"
                color=#16a34a
                :opacity=0.7
                class="font-bold"
                /> 
            </div>
            

            <div class="flex justify-evenly w-full">
                <div class="flex flex-col items-center justify-evenly">
                    <p class="text-lg font-semibold">Matches won</p>
                    <p class="text-2xl font-bold">{{myData.stats.matches_won}}</p>
                    <p class="text-lg font-semibold">Current rating</p>
                    <p class="text-2xl font-bold">{{myData.rating}}</p>
                </div>

                <div class="flex flex-col items-center justify-evenly">
                    <p class="text-lg font-semibold">Tournaments won</p>
                    <p class="text-2xl font-bold">{{myData.stats.tournaments_won}}</p>
                </div>

                <div class="flex flex-col items-center justify-evenly">
                    <p class="text-lg font-semibold">Matches played</p>
                    <p class="text-2xl font-bold">{{myData.stats.matches_played}}</p>
                    <p class="text-lg font-semibold">Highest rating</p>
                    <p class="text-2xl font-bold">{{myData.stats.highest_rating}}</p>
                </div>

            </div>
            
          
        </div>
      </div>
  
      <button @click="goHome" id="home-btn"
              class="absolute top-4 left-4 px-4 py-2 bg-white text-black rounded-md hover:bg-gray-400">
        <v-icon
          name="io-home-sharp" />
      </button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue'
  import router from '@/router'
  import axiosInstance from '@/axios';  
  
  interface Stats{
    matches_played: number;
    matches_won: number;
    tournaments_won: number;
    highest_rating: number;
  }

  interface User {
    _id: string;
    username: string;
    rating: number;
    position: number;
    stats: Stats;
  }
  
  export default defineComponent({
    name: 'UserStatsView',
    setup() {
      const myData = ref<User>({ _id: '', username: '', rating: 0, position: 0, stats: { matches_played: 0, matches_won: 0, tournaments_won: 0, highest_rating: 0 } })
  
      onMounted(async () => {
        myData.value = await axiosInstance.get('/users/me')
            .then(res => res.data)
        console.log(myData.value)
      })
  
      return { myData }
    },
    methods: {
      async goHome() {
        await router.push({ name: 'home' })
      },
    }
  })
  </script>
  
  <style scoped>
  .bg {
    /* Photo credit: FIGIST CO on Unsplash */
    background-image: url("../assets/bg.jpg");
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
  
  </style>
  