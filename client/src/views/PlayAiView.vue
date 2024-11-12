<template>
    <div class="play-ai-view">
      <div class="bg"></div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  
      <div class="w-screen h-screen flex flex-col pt-20 items-center">
  
        <h1 class="text-center text-6xl font-black text-white">PLAY AI</h1>
  
        <div class="flex flex-col mt-20 w-1/2 sm:p-8 p-6 shadow-md rounded-md gap-3 pl-3 py-2 text-sm md:text-lg bg-white items-center">
  
            <div class="flex flex-col justify-evenly lg:flex-row">
                <div class="flex justify-center items-center pl-3 py-2 gap-x-2">
                    <label for="first_to" class="text-right">Difficulty</label>
                    <div class="container">
                        <div class="select">
                        <select name="difficulty" id="difficulty" v-model="difficulty">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                        </div>
                    </div>
                </div>
        
                <div class="flex justify-center items-center pl-3 py-2 gap-x-2">
                    <label for="first_to" class="text-right">Matches to win</label>
                    <div class="container">
                        <div class="select">
                            <select name="first_to" id="first_to" v-model="first_to">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-center">
                <button id="start-btn" @click="startGame"
                    class="mt-2 px-4 py-2 w-full rounded-xl">START
                </button>
            </div>
        </div>
      </div>
  
      <button @click="goHome"
        class="absolute top-4 left-4 px-4 py-2 bg-white text-black rounded-md hover:bg-gray-400"><v-icon name="io-home-sharp" />
      </button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import { sendInviteService } from '@/services/invitesService';
  import router from '@/router';
  
  export default defineComponent({
    name: 'PlayHumanView',
    data(): {
      first_to: number,
      difficulty: string
    } {
      return {
        first_to: 1,
        difficulty: 'easy'
      }
    },
    computed: {
    },
    methods: {
      async goHome() {
        await router.push({ name: 'home' });
      },
      async startGame() {
        console.log('Starting with difficulty:', this.difficulty, 'and first to:', this.first_to);
        /*
        try {
            await sendInviteService("`ai_${this.difficulty}`", this.first_to) //TODO: Implement server-side logic to create match against ai_easy, ai_medium, ai_hard
        } catch (error) {
            console.error('Error sending invite:', error)
        }
        */
      }
    },
    watch: {
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
  
  #start-btn {
    background-color: #16a34a;
    color: white;
  }
  
  #start-btn:hover {
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
  
  
  </style>