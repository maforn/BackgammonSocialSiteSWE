<template>
  <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2">
    <div v-for="error in errors" :key="error.id" class="mt-2 transition-opacity">
      <ErrorNotification :message="error.message" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useWsStore } from '@/stores/wsStore'
import ErrorNotification from '@/components/ErrorNotification.vue'

export default defineComponent({
  name: 'ErrorContainer',
  components: { ErrorNotification },
  setup() {
    const wsStore = useWsStore()
    const { errors } = storeToRefs(wsStore)

    return {
      errors
    }
  }
})
</script>
