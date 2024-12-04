
<template>
  <div class="background"></div>
  <div class="flex justify-center items-center min-h-screen px-4">

    <div class="flex flex-col items-center w-full p-6 space-y-8 bg-gray-100 rounded-lg shadow-lg">
      <!-- Share Buttons -->
      <div id="game-over" class="font-medium relative p-2 rounded" >
        <div class="flex gap-2 mt-4">
          <button @click="shareOnWhatsApp" class="btn-share p-2 rounded bg-green-600 text-white cursor-pointer">
            <v-icon name="io-logo-whatsapp" />
            Share on Whatsapp
          </button>
          <button @click="shareOnTwitter" class="btn-share p-2 rounded bg-blue-500 text-white cursor-pointer">
            <v-icon name="io-logo-twitter" />
            Share on X
          </button>
          <button @click="shareOnFacebook" class="btn-share p-2 rounded bg-blue-700 text-white cursor-pointer">
            <v-icon name="io-logo-facebook" />
            Share on Facebook
          </button>
        </div>
      </div>
      <!-- Player Displays -->
      <div class="flex justify-between items-center w-full gap-6">
        <!-- Player 1 -->
        <div
          id="p1-display"
          class="flex flex-col items-center w-1/3 p-4 text-center text-white rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          :class="username === player1 ? 'player-turn-1' : 'player-turn-2'">
          <v-icon :name="[ai_names.includes(player1) ? 'fa-robot' : 'io-person']" class="mb-2 text-3xl" />
          <h2 class="text-xl font-semibold">{{ player1 }}</h2>
          <!-- Win Circles -->
          <div class="flex mt-2 space-x-1">
            <v-icon
              v-for="i in rounds_to_win"
              :key="i"
              :name="i <= winsP1 ? 'bi-circle-fill' : 'bi-circle'"
              class="text-white"
              width="1em"
              height="1em"
            />
          </div>
        </div>

        <!-- VS Section -->
        <div class="flex flex-col items-center">
          <div class="text-xl font-bold text-gray-700">VS</div>
          <div class="text-lg font-medium bg-yellow-500 text-gray-700 p-2 rounded-lg">{{ matchResult }}</div>
        </div>

        <!-- Player 2 -->
        <div
          id="p2-display"
          class="flex flex-col items-center w-1/3 p-4 text-center  text-white rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          :class="username === player2 ? 'player-turn-1' : 'player-turn-2'">
          <v-icon :name="[ai_names.includes(player2) ? 'fa-robot' : 'io-person']" class="mb-2 text-3xl" />
          <h2 class="text-xl font-semibold">{{ player2 }}</h2>
          <!-- Win Circles -->
          <div class="flex mt-2 space-x-1">
            <v-icon
              v-for="i in rounds_to_win"
              :key="i"
              :name="i <= winsP2 ? 'bi-circle-fill' : 'bi-circle'"
              class="text-white"
              width="1em"
              height="1em"
            />
          </div>
        </div>
      </div>

      <!-- Scores and Action -->
      <div class="flex flex-col items-center w-full space-y-4">
        <!-- Scores -->
        <div class="flex justify-between items-center w-full px-6 text-gray-800">
          <div class="text-center">
            <h3 class="text-lg font-semibold">{{ player1 }}</h3>
            <p>Wins: <span class="font-bold ">{{ winsP1 }}</span></p>
            <p>Rating: <span class="font-bold">{{ scoreP1 }}</span></p>
          </div>
          <div class="text-center">
            <h3 class="text-lg font-semibold">{{ player2 }}</h3>
            <p>Wins: <span class="font-bold ">{{ winsP2 }}</span></p>
            <p v-if="scoreP2!='AI'">Rating: <span class="font-bold">{{ scoreP2 }}</span></p>
          </div>
        </div>

        <!-- Home Button -->
        <button
          class="px-6 py-2 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
          @click="goHome">
          Home
        </button>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import {useRouter} from "vue-router";
import {ref} from "vue";
import {useGameStore} from "@/stores/gameStore";
import {storeToRefs} from "pinia";
import {useAuthStore} from "@/stores/authStore";
import axiosInstance from '@/axios'

export default {
  name: 'MatchOverView',
  setup() {
    const gameStore = useGameStore()
    const { player1, player2, rounds_to_win, winsP1, winsP2, status } = storeToRefs(gameStore)

    const router = useRouter();
    const username = useAuthStore().username
    const ai_names = ["ai_easy", "ai_normal", "ai_hard"];

    const goHome = () => {
      router.push({name: 'home'});
    };

    // get users score
    const ratingP1 = ref()
    const ratingP2 = ref()


    axiosInstance.get('/users/get_user_rating', {params: {username: player1.value}})
      .then(res => ratingP1.value = res.data)
      .catch(err => console.error(err))

    console.log("nome player2 ",player2.value)

    if ( player2.value.startsWith("ai_")) {
      ratingP2.value = "AI"
    } else {
      axiosInstance.get('/users/get_user_rating', {params: {username: player2.value}})
        .then(res => ratingP2.value = res.data)
        .catch(err => console.error(err))
    }



    const matchResult = ref()
    if (status.value === 'player_1_won') {
      matchResult.value = player1.value+" won the match"
    } else {
      matchResult.value = player2.value+" won the match"
    }

    const isPlayer1 = username === player1.value
    const getGameOverShareText= () => {
      if (isPlayer1 && status.value === 'player_1_won') {
        return `I just won a game of backgammon against ${player2.value}! 🏆 Play now!`
      } else if (!isPlayer1 && status.value === 'player_2_won') {
        return `I just won a game of backgammon against ${player1.value}! 🏆 Play now!`
      } else if (isPlayer1 && status.value === 'player_2_won') {
        return `I just lost a game of backgammon against ${player2.value}! 😢 Help me out, play now!`
      } else {
        return `I just lost a game of backgammon against ${player1.value}! 😢 Help me out, play now!`
      }
    }

    const shareOnWhatsApp = async () =>{
      const url = `https://wa.me/?text=${encodeURIComponent(getGameOverShareText())}`;
      window.open(url, '_blank');
    }
    const shareOnTwitter = async () =>{
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getGameOverShareText())}`;
      window.open(url, '_blank');
    }

    const shareOnFacebook = async () =>  {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
      window.open(url, '_blank');
    }

    return {
      username,
      ai_names,
      rounds_to_win,
      player1,
      player2,
      winsP1,
      winsP2,
      scoreP1: ratingP1,
      scoreP2: ratingP2,
      goHome,
      matchResult,
      shareOnWhatsApp,
      shareOnTwitter,
      shareOnFacebook
    }
  }
}

</script>

<style scoped>

#p1-display, #p2-display {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

#p1-display:hover, #p2-display:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.player-turn-1 {
  background-color: #d55;
}

.player-turn-2 {
  background-color: #5656d3;
}
</style>

