<template>
  <div class="bg-red-500 text-white px-4 py-2 rounded shadow-lg">
    {{ message }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotification',
  props: {
    message: {
      type: String,
      required: true
    }
  },
})
</script>
