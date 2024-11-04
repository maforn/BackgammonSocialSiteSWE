<template>
  <div class="h-full flex flex-col lg:flex-row gap-6 xl:gap-8 justify-center">
    <div class="flex flex-col items-center justify-between h-full lg:w-4/5 gap-4 max-w-5xl">
      <div to="/game"
        class="flex justify-end items-center px-8 py-3 bg-gray-600 text-white rounded-r-full rounded-l-full shadow- font-medium">
        Player 1 vs Player 2
      </div>
      <Board class="shadow-lg" :configuration="configuration" />
      <div to="/game"
        class="flex justify-end items-center px-8 py-3 bg-gray-600 text-white rounded-r-full rounded-l-full shadow-md">
        Your turn
      </div>
      <button @click="diceThrow" class="px-4 py-2 bg-blue-500 text-white rounded">Throw Dice</button>
      <div class="dice-container">
        <DieFace v-if="diceResult.die1 !== null" :value="diceResult.die1" />
        <DieFace v-if="diceResult.die2 !== null" :value="diceResult.die2" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Board from '@/components/Board.vue'
import DieFace from '@/components/DieFace.vue'
import { defineComponent } from 'vue'
import { BoardConfiguration } from '@/models/BoardConfiguration'
import axiosInstance from '@/axios'

export default defineComponent({
  name: 'GameView',
  components: {
    Board,
    DieFace,
  },
  data() {
    return {
      configuration: new BoardConfiguration(),
      diceResult: {
        die1: null,
        die2: null,
      },
    }
  },
  methods: {
    async diceThrow() {
      try {
        const response = await axiosInstance.get('/throw_dice')
        this.diceResult.die1 = response.data.die1
        this.diceResult.die2 = response.data.die2
        console.log('Dice throw result:', response.data)
      } catch (error) {
        console.error('Error fetching dice throw result:', error)
      }
    }
  }
})
</script>

<style>
.dice-container {
  display: flex;
  gap: 10px;
}

.dice {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;
  font-size: 24px;
}

.commentary {
  background-color: #b2b2b2;
}
</style>
