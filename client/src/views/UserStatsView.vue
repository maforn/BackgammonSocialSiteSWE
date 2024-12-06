  <template>
    <div class="user-stats-view">
      <div class="bg fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-800"></div>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />

      <div class="w-full h-full px-12 py-8">
        <div class="flex items-center mb-8">
          <button
            @click="goHome"
            class="px-4 py-3 bg-white text-black rounded-full shadow-lg hover:bg-gray-300 transition-colors mr-6"
          >
            <i class="fas fa-home"></i>
          </button>
          <h1 class="text-5xl font-extrabold text-white drop-shadow-lg flex-1 text-center">YOUR STATS</h1>
        </div>

        <div class="w-full max-w-7xl mx-auto bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-lg p-8 flex gap-12">
          <div class="flex-1 flex flex-col items-center">
            <h2 class="text-3xl font-bold text-gray-800 mb-6">{{ myData.username }}</h2>
            <pie-chart
              :percent="myData.stats.matches_won / (myData.stats.matches_played == 0 ? 1 : myData.stats.matches_played) * 100"
              :stroke-width="1"
              :label="`${truncate2decimal(myData.stats.matches_won / (myData.stats.matches_played == 0 ? 1 : myData.stats.matches_played) * 100)}%`"
              label-small="Win rate"
              color="#16a34a"
              :opacity="0.8"
              class="w-1/2 transform transition-transform hover:scale-110"
            />
          </div>

          <div class="flex-1 flex flex-col gap-4">
            <div
              class="flex justify-between items-center bg-indigo-100 rounded-lg p-4 shadow-md transform hover:scale-105 transition-transform"
            >
              <p class="text-lg font-medium text-indigo-700">Matches Won</p>
              <p class="text-2xl font-bold text-indigo-900">{{ myData.stats.matches_won }}</p>
            </div>
            <div
              class="flex justify-between items-center bg-blue-100 rounded-lg p-4 shadow-md transform hover:scale-105 transition-transform"
            >
              <p class="text-lg font-medium text-blue-700">Tournaments Won</p>
              <p class="text-2xl font-bold text-blue-900">{{ myData.stats.tournaments_won }}</p>
            </div>
            <div
              class="flex justify-between items-center bg-purple-100 rounded-lg p-4 shadow-md transform hover:scale-105 transition-transform"
            >
              <p class="text-lg font-medium text-purple-700">Matches Played</p>
              <p class="text-2xl font-bold text-purple-900">{{ myData.stats.matches_played }}</p>
            </div>
            <div
              class="flex justify-between items-center bg-green-100 rounded-lg p-4 shadow-md transform hover:scale-105 transition-transform"
            >
              <p class="text-lg font-medium text-green-700">Current Rating</p>
              <p class="text-2xl font-bold text-green-900">{{ myData.rating }}</p>
            </div>
            <div
              class="flex justify-between items-center bg-red-100 rounded-lg p-4 shadow-md transform hover:scale-105 transition-transform"
            >
              <p class="text-lg font-medium text-red-700">Highest Rating</p>
              <p class="text-2xl font-bold text-red-900">{{ myData.stats.highest_rating }}</p>
            </div>
          </div>
        </div>
      </div>
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
      truncate2decimal(number2trunc :number) {
        if (number2trunc.toString().includes('.') && number2trunc.toString().split('.')[1].length > 2) {
          return parseFloat(number2trunc.toFixed(2));
        }
        return number2trunc;
      }
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
