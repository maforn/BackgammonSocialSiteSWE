<template>
  <div class="font-[sans-serif]">
    <div class="bg"></div>
    <div class="min-h-screen flex flex-col items-center justify-center">
      <div class="max-w-3xl max-md:max-w-lg p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md" id="box">
        <div class="md:max-w-md w-full px-4 py-4">
          <h3 class="text-black text-3xl font-extrabold">Reset Password</h3>
          <form @submit.prevent="buttonResetPassword" class="space-y-6">
            <div>
              <label class="text-sm mb-2 block">New Password
                <div class="relative flex items-center">
                  <input
                    v-model="newPassword"
                    type="password"
                    required
                    class="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 pr-10 py-2.5 rounded-md outline-blue-500"
                    placeholder="Enter new password"
                  />
                </div>
              </label>
            </div>
            <div>
              <label class="text-sm mb-2 block">Confirm New Password
                <div class="relative flex items-center">
                  <input
                    v-model="confirmNewPassword"
                    type="password"
                    required
                    class="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 pr-10 py-2.5 rounded-md outline-blue-500"
                    placeholder="Enter new password again"
                  />
                </div>
              </label>
            </div>
            <p class="mb-3 text-red-500">{{ message }}</p>
            <div class="!mt-8">
              <button
                type="submit"
                class="w-full py-2.5 px-4 text-sm tracking-wider font-semibold rounded-md bg-green-600 hover:bg-green-700 text-white focus:outline-none"
              >
                Reset Password
              </button>
            </div>
          </form>
          <div class="flex items-center justify-center w-full">
            <button @click="goBack" class="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800">Home
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { resetPassword } from '@/services/authService';
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'PasswordResetView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const token = ref('');
    const newPassword = ref('');
    const confirmNewPassword = ref('');
    const message = ref('');

    onMounted(() => {
      token.value = route?.query?.token as string || '';
    });

    const buttonResetPassword = async () => {
      if (newPassword.value !== confirmNewPassword.value) {
        message.value = 'Passwords do not match';
        return;
      }
      try {
        const response = await resetPassword(newPassword.value, token.value);
        message.value = response.data.message || 'Password reset successful';
      } catch (error) {
        message.value = 'Error resetting password';
      }
    };

    const goBack = () => {
      router.push('/');
    };

    return { token, newPassword, confirmNewPassword, message, buttonResetPassword, goBack };
  },
});
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
