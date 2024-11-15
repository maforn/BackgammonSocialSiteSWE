<template>
	<div class="h-full flex flex-col lg:flex-row gap-6 xl:gap-8 justify-center p-4">
		<div class="background"></div>
		<div class="flex flex-col items-center justify-between h-full lg:w-4/5 gap-4 max-w-5xl">
      <div class="flex justify-center w-full gap-4">
        <div id="p1-display" class="flex flex-col justify-center items-center px-8 py-3 bg-gray-600 text-white rounded-r-full rounded-l-full shadow-md font-medium">
          {{ player1 }}
          <div class="flex justify-evenly">
            <div v-for="i in first_to">
              <v-icon :name="i <= winsP1 ? 'bi-circle-fill' : 'bi-circle'" width="0.7em" height="0.7em"/>
            </div>
          </div>
        </div>

        <div class="flex items-center text-white font-bold">
          VS
        </div>

        <div id="p2-display" class="flex flex-col justify-center items-center px-8 py-3 bg-gray-600 text-white rounded-r-full rounded-l-full shadow-md font-medium">
          {{ player2 }}
          <div class="flex justify-evenly">
            <div v-for="i in first_to">
              <v-icon :name="i <= winsP2 ? 'bi-circle-fill' : 'bi-circle'" width="0.7em" height="0.7em"/>
            </div>
          </div>
        </div>
      </div>
			<div class="relative">
				<GameBoard
					:configuration="configuration"
					:player1="isPlayer1"
					:dice="availableDice"
					:your-turn="isYourTurn"
					@movePiece="movePiece"
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
					<DieFace v-for="(die, index) in availableDice" :key="index" :value="die" />
				</div>
			</div>
      <div class="messages absolute p-8 flex flex-col-reverse">
        <div v-for="message in messages" :key="message.id"
             :class="['message', message.user === username ? 'your-message' : 'opponent-message']">
          {{ message.message }}
        </div>
      </div>
      <div class="flex gap-2 mt-4 flex-wrap" v-if="configuration">
        <button v-for="msg in preformedMessages" :key="msg" class="btn-preformed p-2 rounded bg-blue-500 text-white cursor-pointer" @click="sendPreformedMessage(msg)">
          {{ msg }}
        </button>
      </div>
		</div>
	</div>
</template>

<script lang="ts">
import DieFace from '@/components/DieFace.vue'
import { computed, defineComponent } from 'vue'
import axiosInstance from '@/axios'
import GameBoard from '@/components/GameBoard.vue'
import { BoardConfiguration } from '@/models/BoardConfiguration';
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import { useWsStore } from '@/stores/wsStore'
import { useAuthStore } from '@/stores/authStore'
import { isAxiosError } from 'axios'
import type { BoardConfiguration } from '@/models/BoardConfiguration'

export default defineComponent({
  name: 'GameView',
  components: {
    GameBoard,
    DieFace
  },
  setup() {
    const gameStore = useGameStore()
    const { turn, dice, boardConfiguration, player1, player2, first_to, winsP1, winsP2 } = storeToRefs(gameStore)

    const wsStore = useWsStore()
    const { messages } = storeToRefs(wsStore)

    const username = useAuthStore().username

    useGameStore()
      .fetchGame()
      .catch(error => {
        if (isAxiosError(error)) {
          wsStore.addError(error?.response?.data?.detail)
        }
      })

    const preformedMessages = ['Ottima mossa!', 'Per poco!', 'Buona fortuna!', 'Oops', 'È il tuo turno!', 'Che peccato!']

    const sendPreformedMessage = async (message: string) =>  {
      try {
        await axiosInstance.post('/game/message', { message })
      } catch (error) {
        if (isAxiosError(error)) {
          useWsStore().addError(error?.response?.data?.detail)
        }
      }
    }

    return {
      configuration: computed(() => boardConfiguration.value),
      isPlayer1: computed(() => username === player1.value),
      thrower: computed(() => (turn.value % 2) + 1),
      diceResult: {
        die1: computed(() => (dice.value.roll.length > 0 ? dice.value.roll[0] : null)),
        die2: computed(() => (dice.value.roll.length > 1 ? dice.value.roll[1] : null))
      },
      availableDice: computed(() => dice.value.available),
      player1,
      player2,
      turn,
      first_to,
      winsP1,
      winsP2,
      messages,
      username,
      preformedMessages,
      sendPreformedMessage
    }
  },
  methods: {
    async diceThrow() {
      try {
        await axiosInstance.get('/throw_dice')
      } catch (error) {
        if (isAxiosError(error)) {
          useWsStore().addError(error?.response?.data?.detail)
        }
      }
    },
    movePiece(board: BoardConfiguration, dice: number) {
			axiosInstance
				.post('/move_piece', {
					board,
					dice,
				})
				.catch(error => {
					if (isAxiosError(error)) {
						useWsStore().addError(error?.response?.data?.detail);
					}
				});
		},
  },
  computed: {
		isYourTurn(): boolean {
			if ((this.turn % 2 === 0 && this.isPlayer1) || (this.turn % 2 === 1 && !this.isPlayer1)) {
				return true;
			} else {
				return false;
			}
		},
		diceThrown(): boolean {
			return this.diceResult.die1.value !== null && this.diceResult.die2.value !== null;
		},
	},
})
</script>

<style>
.messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.message {
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  color: white;
  word-wrap: break-word;
}

.your-message {
  align-self: flex-end;
  background-color: #d55;
}

.opponent-message {
  align-self: flex-start;
  background-color: #5656d3;
}

.background {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  background-color: #7f5353;
  background-image: url("../assets/wood-pattern.png");
  filter: brightness(70%);
  overflow: hidden;
  z-index: -101;
}

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
