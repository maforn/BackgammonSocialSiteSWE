<template>
  <div class="font-[sans-serif]">
    <div class="bg"></div>
    <div class="min-h-screen flex flex-col items-center justify-center">
      <div class="max-w-3xl max-md:max-w-lg p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md" id="box">
        <div class="md:max-w-md w-full px-4 py-4">
          <h3 class="text-black text-3xl font-extrabold">Password Recovery</h3>
          <form @submit.prevent="buttonRequestPasswordRecovery" class="space-y-6">
            <div>
              <label class="text-sm mb-2 block">Email
                <div class="relative flex items-center">
                  <input
                    v-model="email"
                    type="email"
                    required
                    class="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 pr-10 py-2.5 rounded-md outline-blue-500"
                    placeholder="Enter your email"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    class="w-4 h-4 absolute right-4"
                    viewBox="0 0 682.667 682.667"
                  >
                    <defs>
                      <clipPath id="a" clipPathUnits="userSpaceOnUse">
                        <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                      </clipPath>
                    </defs>
                    <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                      <path
                        fill="none"
                        stroke-miterlimit="10"
                        stroke-width="40"
                        d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                        data-original="#000000"
                      ></path>
                      <path
                        d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                        data-original="#000000"
                      ></path>
                    </g>
                  </svg>
                </div>
              </label>
            </div>
            <p class="mb-3 text-red-500">{{ message }}</p>
            <div class="!mt-8">
              <button
                type="submit"
                class="w-full py-2.5 px-4 text-sm tracking-wider font-semibold rounded-md bg-green-600 hover:bg-green-700 text-white focus:outline-none"
              >
                Send Recovery Email
              </button>
            </div>
          </form>
          <div class="flex items-center justify-center w-full">
            <button @click="goBack" class="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800">Back
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { requestPasswordRecovery } from '@/services/authService'

export default defineComponent({
  name: 'PasswordRecoveryView',
  setup() {
    const email = ref('')
    const message = ref('')

    const buttonRequestPasswordRecovery = async () => {
      try {
        const response = await requestPasswordRecovery(email.value)
        message.value = response.data.message || 'Recovery email sent';
      } catch (error: any) {
        message.value = 'Error sending recovery email'
      }
    }

    const goBack = () => {
      window.history.back()
    }

    return { email, message, buttonRequestPasswordRecovery, goBack }
  }
})
</script>

<style scoped>
.bg {
  background-image: url('../assets/bg.jpg');
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

#box {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(70%);
}
</style>
