<template>
  <div class="play-ai-view">
    <div class="bg"></div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

    <div class="w-screen h-screen flex flex-col pt-20 items-center">

      <h1 class="text-center text-6xl font-black text-white">PLAY AI</h1>

      <div
        class="flex flex-col mt-20 w-1/2 sm:p-8 p-6 shadow-md rounded-md gap-3 pl-3 py-2 text-sm md:text-lg bg-white items-center">

        <div class="flex flex-col justify-evenly lg:flex-row">
          <div class="flex justify-center items-center pl-3 py-2 gap-x-2">
            <label for="rounds_to_win" class="text-right">Difficulty</label>
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
            <label for="rounds_to_win" class="text-right">Rounds to win</label>
            <div class="container">
              <div class="select">
                <select name="rounds_to_win" id="rounds_to_win" v-model="rounds_to_win">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <button id="start-btn" @click="startGame" class="mt-2 px-4 py-2 w-full rounded-xl"
            :disabled="hasSuspendedGame">START
          </button>
        </div>
      </div>
    </div>

    <button @click="goHome" id="home-btn"
      class="absolute top-4 left-4 px-4 py-2 bg-white text-black rounded-md hover:bg-gray-400"><v-icon
        name="io-home-sharp" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { sendInviteService } from '@/services/invitesService';
import { useGameStore } from '@/stores/gameStore';
import router from '@/router';

export default defineComponent({
  name: 'PlayAiView',
  setup() {
    const hasSuspendedGame = ref(true)

    useGameStore()
      .checkSuspendedGameExists()
      .then((exists) => {
        hasSuspendedGame.value = exists
      });

    return { hasSuspendedGame }
  },
  data(): {
    rounds_to_win: number,
    difficulty: string,
    hasSuspendedGame: boolean
  } {
    return {
      rounds_to_win: 1,
      difficulty: 'easy',
      hasSuspendedGame: true
    }
  },
  computed: {
  },
  methods: {
    async goHome() {
      await router.push({ name: 'home' });
    },
    async startGame() {
      try {
        await sendInviteService("ai_" + this.difficulty, this.rounds_to_win, false)
        await useGameStore().fetchGame();
        await router.push({ name: 'game' });
      } catch (error) {
        console.error('Error sending invite:', error)
      }
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

#start-btn:hover {
  background-color: #15803d;
}

#start-btn:disabled {
  background-color: #14532d;
  color: gray;
  cursor: not-allowed;
}

#start-btn {
  background-color: #16a34a;
  color: white;
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
