<template>
  <div :class="color + ' text-white px-4 py-2 rounded shadow-lg'">
    {{ message }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NotificationComponent',
  props: {
    message: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'red'
    }
  }
})
</script>
