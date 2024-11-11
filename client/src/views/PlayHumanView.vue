<template>
  <div class="play-human-view">
    <div class="bg"></div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

    <div class="w-screen h-screen flex flex-col pt-20 items-center">

      <h1 class="text-center text-6xl font-black text-white">PLAY HUMAN</h1>

      <div class="flex flex-col mt-20 w-1/2 sm:p-8 p-6 shadow-md rounded-md gap-3 pl-3 py-2 text-sm md:text-lg bg-white">
        <button
          class="flex justify-center items-center pl-3 py-2 bg-green-600 text-white rounded-r-full rounded-l-full hover:bg-green-700 shadow-md">
          RANDOM OPPONENT
        </button>

        <div class="flex justify-evenly items-center pl-3 py-2">
          <hr style="border-color: black;">
          <span class="text-black text-sm">OR</span>
          <hr style="border-color: black;">
        </div>

        <div
          class="relative flex justify-center items-center pl-3 pe-3 py-2 bg-gray-900 text-white rounded-r-full rounded-l-full shadow-sm">
          <input
            v-model="searchQuery"
            @input="onInput"
            class="flex-grow pl-3 py-2 outline-none bg-gray-900 text-white"
            placeholder="Search by username..."
          />
          <i class="fas fa-search text-white pr-3"></i>
          <ul v-if="showDropdown"
              class="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 z-10">
            <li
              v-for="user in filteredUsers"
              :key="user.username"
              class="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
              @click="selectUser(user)"
            >
              {{ user.username }}
            </li>
          </ul>
        </div>

        <div class="flex justify-center items-center pl-3 py-2 gap-x-2">
          <label for="first_to">Matches to win:</label>
          <select name="first_to" id="first_to" v-model="first_to">
            <option value="1">1</option>
            <option value="3">3</option>
            <option value="5">5</option>
          </select>
        </div>

        <div class="flex justify-center">
          <button id="invite-btn" :disabled="isButtonDisabled" @click="sendInvite"
                  class="mt-2 px-4 py-2 w-2/3 rounded-xl">Invite
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
import { debounce } from 'lodash'
import { sendInviteService } from '@/services/invitesService';
import axiosInstance from '@/axios'
import router from '@/router';

export default defineComponent({
  name: 'PlayHumanView',
  data(): {
    searchQuery: string;
    users: Array<{ id: number; username: string }>;
    showDropdown: boolean;
    isButtonDisabled: boolean,
    first_to: number
  } {
    return {
      searchQuery: '',
      users: [] as Array<{ id: number; username: string }>,
      showDropdown: false,
      isButtonDisabled: true,
      first_to: 1
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(u =>
        u.username.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    onInput: debounce(function(this: {
      searchQuery: string;
      fetchUsers: () => void;
      showDropdown: boolean;
      isButtonDisabled: boolean
    }) {
      this.isButtonDisabled = true
      if (this.searchQuery.length >= 2) {
        this.fetchUsers()
      } else {
        this.showDropdown = false
      }
    }, 300),
    async goHome() {
      await router.push({ name: 'home' });
    },
    async fetchUsers() {
      try {
        const response = await axiosInstance.get('/users/search', {
          params: { query: this.searchQuery }
        })
        if (Array.isArray(response.data)) {
          this.users = response.data.map(u => ({ id: u.id, username: u.username })) // Ensure each item is an object with id and username properties
        } else {
          this.users = []
        }
        this.showDropdown = this.users.length > 0
      } catch (error) {
        console.error('Error fetching users:', error)
        this.users = []
      }
    },
    selectUser(user: { username: string }) {
      this.searchQuery = user.username
      this.showDropdown = false
      this.isButtonDisabled = false
    },
    async sendInvite() {
      try {
        await sendInviteService(this.searchQuery, this.first_to)
        this.searchQuery = ''
        this.isButtonDisabled = true
      } catch (error) {
        console.error('Error sending invite:', error)
      }
    }
  },
  watch: {
    searchQuery() {
      if (this.searchQuery.length < 2) {
        this.showDropdown = false
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

hr {
  width: 30%;
  height: 1px;
  border-color: white;
}

#invite-btn:disabled {
  background-color: #14532d;
  color: gray;
  cursor: not-allowed;
}

#invite-btn {
  background-color: #16a34a;
  color: white;
}

#invite-btn:not(:disabled):hover {
  background-color: #15803d;
}

option:hover, select:hover {
  cursor: pointer;
}
</style>
