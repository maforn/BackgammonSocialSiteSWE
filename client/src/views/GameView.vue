<template>
  <div class="h-full flex flex-col lg:flex-row gap-6 xl:gap-8 justify-center">
    <div class="flex flex-col items-center justify-between h-full lg:w-4/5 gap-4 max-w-5xl">
      <div to="/game" class="flex justify-end items-center px-8 py-3 bg-gray-600 text-white rounded-r-full rounded-l-full shadow- font-medium">
        Player 1 vs Player 2
      </div>
      <Board class="shadow-lg" :configuration="configuration"/>
      <div to="/game" class="flex justify-end items-center px-8 py-3 bg-gray-600 text-white rounded-r-full rounded-l-full shadow-md">
        Your turn
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Board from '@/components/Board.vue'
import { defineComponent } from 'vue'
import { BoardConfiguration } from '@/models/BoardConfiguration'

export default defineComponent({
  name: 'GameView',
  components: {
    Board,
  },
  data() {
    return {
      configuration: new BoardConfiguration(),
    }
  },
})
</script>

<style>
.commentary {
  background-color: #b2b2b2;
}
</style>
