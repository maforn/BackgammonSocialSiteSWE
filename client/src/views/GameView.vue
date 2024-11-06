<template>
  <div class="h-full flex flex-col lg:flex-row gap-6 xl:gap-8 justify-center">
    <div class="flex flex-col items-center justify-between h-full lg:w-4/5 gap-4 max-w-5xl">
      <div class="flex items-center px-8 py-3 bg-gray-600 text-white rounded-r-full rounded-l-full shadow- font-medium">
        {{ player1 }} vs {{ player2 }}
      </div>
      <div class="relative">
        <GameBoard
          class="shadow-lg"
          :configuration="configuration"
          :player1="isPlayer1"
          :dices="availableDices"
          :your-turn="isYourTurn"
          :used="usedDice"
        />
        <button v-if="!diceThrown && isYourTurn" class="dice-button p-2 w-10 sm:w-16 lg:w-20" @click.stop="diceThrow">
          <v-icon name="gi-rolling-dices" width="100%" height="100%" />
        </button>
      </div>
      <div class="flex gap-2">
        <div
          :class="[
						'flex',
						'items-center',
						'px-8',
						'h-12',
						'py-3',
						'text-white',
						'rounded-r-full',
						'rounded-l-full',
						'shadow-md',
						isYourTurn ? 'player-turn-1' : 'player-turn-2',
					]"
        >
          {{ isYourTurn ? 'Your turn' : 'Opponent\'s turn' }}
        </div>
        <div
          v-if="diceThrown"
          :class="[
						'dice-container',
						'flex',
						'items-center',
						'px-8',
						'h-12',
						'py-1.5',
						'text-white',
						'rounded-r-full',
						'rounded-l-full',
						'shadow-md',
						isYourTurn ? 'player-turn-1' : 'player-turn-2',
					]"
        >
          <DieFace v-if="diceResult.die1.value !== null" :value="diceResult.die1.value" />
          <DieFace v-if="diceResult.die2.value !== null" :value="diceResult.die2.value" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DieFace from '@/components/DieFace.vue'
import { computed, defineComponent } from 'vue'
import axiosInstance from '@/axios'
import GameBoard from '@/components/GameBoard.vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import { useWsStore } from '@/stores/wsStore'
import { useAuthStore } from '@/stores/authStore'
import { isAxiosError } from 'axios'

export default defineComponent({
  name: 'GameView',
  components: {
    GameBoard,
    DieFace
  },
  setup() {
    const gameStore = useGameStore()
    const { turn, dice, boardConfiguration, player1, player2 } = storeToRefs(gameStore)

    useGameStore().fetchGame()

    return {
      configuration: computed(() => boardConfiguration.value),
      isPlayer1: computed(() => useAuthStore().username === player1.value),
      thrower: computed(() => (turn.value % 2) + 1),
      diceResult: {
        die1: computed(() => (dice.value.roll.length > 0 ? dice.value.roll[0] : null)),
        die2: computed(() => (dice.value.roll.length > 1 ? dice.value.roll[1] : null))
      },
      usedDice: computed(() => dice.value.used),
      player1,
      player2,
      turn
    }
  },
  methods: {
    async diceThrow() {
      try {
        await axiosInstance.get('/throw_dice')
      } catch (error) {
        if (isAxiosError(error)) {useWsStore().addError(error?.response?.data?.detail)}
      }
    }
  },
  computed: {
    isYourTurn(): boolean {
      if ((this.turn % 2 === 0 && this.isPlayer1) || (this.turn % 2 === 1 && !this.isPlayer1)) {
        return true
      } else {
        return false
      }
    },
    diceThrown(): boolean {
      return this.diceResult.die1.value !== null && this.diceResult.die2.value !== null
    },
    availableDices(): number[] {
      return this.diceResult.die1.value === this.diceResult.die2.value ? [this.diceResult.die1.value!, this.diceResult.die2.value!] : [this.diceResult.die1.value!, this.diceResult.die2.value!].filter(
        dice => dice && !this.usedDice.includes(dice)
      )
    }
  }
})
</script>

<style>
.dice-button {
  aspect-ratio: 1;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  bottom: 0;
  margin-bottom: 1em;
  transform: translateX(-50%);
  animation: dice-pulse 2s infinite;
  background-color: #d55;
}

@keyframes dice-pulse {
  0%,
  100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.25);
  }
}

.dice-container {
  display: flex;
  gap: 10px;
}

.player-turn-1 {
  background-color: #d55;
}

.player-turn-2 {
  background-color: #5656d3;
}

.icon-scale {
  /* Default scale */
  font-size: 1.5rem;

  /* Medium screens and up */
  @media (min-width: 768px) {
    font-size: 2rem;
  }

  /* Large screens and up */
  @media (min-width: 1024px) {
    font-size: 2.5rem;
  }

  /* Extra large screens and up */
  @media (min-width: 1280px) {
    font-size: 3rem;
  }
}
</style>
