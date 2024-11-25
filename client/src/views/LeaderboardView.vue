<template>
    <div class="leaderboard-view">
      <div class="bg"></div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

      <div class="w-screen h-screen flex flex-col pt-20 items-center">

        <h1 class="text-center text-6xl font-black text-white">LEADERBOARD</h1>

        <div v-if="myData"
          class="flex flex-col mt-20 w-5/6 sm:p-8 p-6 shadow-md rounded-md gap-3 pl-3 py-2 text-sm md:text-lg bg-white items-center">

                <div v-for="u in usersData.slice(0, usersData.length-1)" class="leaderboard-object flex w-5/6 flex-col justify-evenly gap-3">
                    <div class="flex gap-1 justify-evenly" :class="`${getPositionColor(u.position)}`">
                        <div class="w-1/12 font-black text-center self-center">
                            <v-icon v-if="u.position <= 3" name="fa-medal" scale="1.5" />
                            #{{u.position}}
                        </div>

                        <div
                            class="flex w-2/3 justify-end items-center pl-3 py-2 bg-black text-white rounded-r-full rounded-l-full shadow-md">
                            <div class="w-full h-full flex justify-center items-center font-medium">
                                {{ u.username }}
                            </div>
                        </div>
                        <div
                            class="flex w-1/6 justify-center items-center pl-3 py-2 bg-green-600 text-white rounded-r-full rounded-l-full shadow-md">
                            <div class="w-full h-full flex justify-center items-center font-medium">
                                {{ u.rating }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Not very elegant, repeat the same pattern as the user info displays but hide most things to easily align the ellipsis to usernames-->
                <div v-if="!userIsInTop" class="flex w-full flex-col justify-evenly items-center gap-3">
                  <div class="flex w-5/6 flex-col justify-evenly gap-3">
                    <div class="flex gap-1 justify-evenly" :class="`${getPositionColor(0)}`">
                        <div class="w-1/12 font-black text-center self-center">
                        </div>

                        <div
                            class="flex w-2/3 justify-end items-center pl-3 py-2 bg-white text-white rounded-r-full rounded-l-full">
                            <div class="w-full h-full flex justify-center items-center font-medium">
                              <v-icon name="fa-ellipsis-h" scale="1.5" class="text-gray-400"></v-icon>
                            </div>
                        </div>
                        <div
                            class="flex w-1/6 justify-center items-center pl-3 py-2 bg-none text-white rounded-r-full rounded-l-full">
                            <div class="w-full h-full flex justify-center items-center font-medium">

                            </div>
                        </div>
                    </div>
                </div>
                <!---->

                <div class="flex w-full flex-col justify-evenly items-center gap-3 leaderboard-object">
                  <div class="flex w-5/6 flex-col justify-evenly gap-3">
                    <div class="flex gap-1 justify-evenly" :class="`${getPositionColor(myData.position)}`">
                        <div class="w-1/12 font-black text-center self-center">
                            <v-icon v-if="myData.position <= 3" name="fa-medal" scale="1.5" />
                            #{{myData.position}}
                        </div>

                        <div
                            class="flex w-2/3 justify-end items-center pl-3 py-2 bg-black text-white rounded-r-full rounded-l-full shadow-md">
                            <div class="w-full h-full flex justify-center items-center font-medium">
                                {{ myData.username }}
                            </div>
                        </div>
                        <div
                            class="flex w-1/6 justify-center items-center pl-3 py-2 bg-green-600 text-white rounded-r-full rounded-l-full shadow-md">
                            <div class="w-full h-full flex justify-center items-center font-medium">
                                {{ myData.rating }}
                            </div>
                        </div>
                    </div>
                </div>
        </div>
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
  import { defineComponent, ref, onMounted } from 'vue'
  import router from '@/router';
  import { getTop5AndMe } from '@/services/ratingService';

  interface User {
    _id: string;
    username: string;
    rating: number;
    position: number;
  }

  export default defineComponent({
    name: 'LeaderboardView',
    setup() {
      const myData = ref<User>({ _id: '', username: '', rating: 0, position: 0 });
      const usersData = ref<User[]>([]);
      const userIsInTop = ref(false);

      onMounted(async () => {
        usersData.value = await getTop5AndMe();
        const len = usersData.value.length;

        userIsInTop.value = usersData.value.filter((user, index, self) =>
            self.findIndex(u => u.username === user.username) !== index).length > 0;

        // The user's data is the last element in the usersData array due to how the API is defined
        myData.value = {_id : usersData.value[len-1]._id,
          username : usersData.value[len-1].username,
          rating : usersData.value[len-1].rating,
          position: usersData.value[len-1].position};
        console.log("myData", myData.value);
      })

      return { usersData, myData, userIsInTop }
    },
    methods: {
      async goHome() {
        await router.push({ name: 'home' });
      },
      getPositionColor(index: number) {
        switch (index) {
          case 1: //Gold
            return 'text-amber-500';
          case 2: //Silver
            return 'text-indigo-300';
          case 3: //Bronze
            return 'text-orange-700';
          default:
            return 'text-black';
        }
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
