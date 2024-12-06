<template>
  <div class="h-full flex flex-col lg:flex-row gap-6 xl:gap-8 justify-center">
    <QuitModal v-if="isModalVisible" @confirm="confirmQuit" @cancel="cancelQuit" />
    <div class="background"></div>
    <div class="flex flex-col items-center justify-between h-full lg:w-4/5 gap-4 max-w-5xl">
      <div class="flex justify-center w-full gap-4 mt-6" v-if="started">
        <div id="p1-display"
             class="flex flex-col justify-center items-center px-8 py-4 text-white rounded-r-full rounded-l-full shadow-md font-medium relative"
             :class="username == player1 ? 'player-turn-1' : 'player-turn-2'">
             <div class="flex gap-3 items-center justify-center">
              <v-icon :name="[ai_names.includes(player1) ? 'fa-robot' : 'io-person']" class="text-white" />
              {{ player1 }}
              <div class="flex justify-evenly -mt-1">
            <div v-for="i in rounds_to_win">
              <v-icon :name="i <= winsP1 ? 'bi-circle-fill' : 'bi-circle'" width="0.6em" height="0.6em" />
            </div>
          </div>
             </div>
        </div>

        <div class="flex items-center text-white font-bold">
          VS
        </div>

        <div id="p2-display"
             class="flex flex-col justify-center items-center px-8 py-2 text-white rounded-r-full rounded-l-full shadow-md font-medium relative"
             :class="username == player2 ? 'player-turn-1' : 'player-turn-2'">
             <div class="flex gap-3 items-center justify-center">
          <v-icon :name="[ai_names.includes(player2) ? 'fa-robot' : 'io-person']" class="text-white" />
          {{ player2 }}
          <div class="flex justify-evenly -mt-1">
            <div v-for="i in rounds_to_win">
              <v-icon :name="i <= winsP2 ? 'bi-circle-fill' : 'bi-circle'" width="0.6em" height="0.6em" />
            </div>
          </div>
        </div>
        </div>
      </div>
      <div id="game-over" class="font-medium relative p-2 rounded" v-if="gameOver">
        <div class="flex gap-2 mt-4">
          <button @click="shareOnWhatsApp" class="btn-share p-2 rounded bg-green-600 text-white cursor-pointer">
            <v-icon name="io-logo-whatsapp" />
            Share on Whatsapp
          </button>
          <button @click="shareOnTwitter" class="btn-share p-2 rounded bg-blue-500 text-white cursor-pointer">
            <v-icon name="io-logo-twitter" />
            Share on X
          </button>
          <button @click="shareOnFacebook" class="btn-share p-2 rounded bg-blue-700 text-white cursor-pointer">
            <v-icon name="io-logo-facebook" />
            Share on Facebook
          </button>
        </div>
      </div>
      <div id="game-over" class="bg-yellow-500 font-medium relative p-2 rounded" v-if="gameOver">{{ winnerMessage }}
      </div>
      <div class="relative" v-if="started">
        <GameBoard :configuration="configuration" :player1="isPlayer1" :dice="availableDice" :your-turn="isYourTurn"
                   @movePiece="movePiece" @noAvailableMoves="buttonShower" />
        <button v-if="diceThrowAllowed" class="dice-button p-2 w-10 sm:w-16 lg:w-20" @click.stop="diceThrow">
          <v-icon name="gi-rolling-dices" width="100%" height="100%" />
        </button>
      </div>
      <div v-else class="flex flex-col items-center justify-center gap-4 mt-20 text-center">
        <h3 class="text-4xl font-black text-white text-shadow">{{ initialText }}</h3>
        <div class="grid grid-cols-2 gap-x-8 gap-y-4 mt-10">
          <p class="text-white text-lg font-bold">
            Throw #{{ startDice.count1 }}
          </p>
          <p class="text-white text-lg font-bold">
            Throw #{{ startDice.count2 }}
          </p>
          <div class="size-32">
            <DieFace :value="startDice.roll1" />
          </div>
          <div class="size-32">
            <DieFace :value="startDice.roll2" />
          </div>
          <div class="text-center px-4 py-2 text-white rounded-r-full rounded-l-full shadow-md font-medium"
               :class="username == player1 ? 'player-turn-1' : 'player-turn-2'">
            {{ player1 }}
          </div>
          <div class="text-center px-4 py-2 text-white rounded-r-full rounded-l-full shadow-md font-medium"
               :class="username == player2 ? 'player-turn-1' : 'player-turn-2'">
            {{ player2 }}
          </div>
        </div>
        <button class="start-button start-pulse p-2 w-10 sm:w-16 lg:w-20 mt-12" @click.stop="throwStartDice"
                v-if="startDiceThrowAllowed">
          <v-icon name="gi-rolling-dices" width="100%" height="100%" />
        </button>
        <button v-if="starter > 0"
                class="px-6 py-2 mt-12 text-white font-bold text-lg shadow-md rounded-r-full rounded-l-full bg-slate-500 start-pulse"
                @click.stop="startPlaying">
          Start playing!
        </button>
      </div>
      <div class="flex gap-2 flex-wrap" v-if="started">
        <div :class="[
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
        ]">
          <span class="text-lg font-semibold">x{{ Math.pow(2, doublingCube.count) }} <v-icon name="fa-dice-d20" />
          </span>
          <button class="start-pulse ml-4 font-semibold" v-if="canDouble" @click="proposeDoubling">Double</button>
        </div>
        <div :class="[
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
        ]">
          {{ isYourTurn ? 'Your turn' : 'Opponent\'s turn' }} | Remaining time:
          00:{{ remainingTime.toString().padStart(2, '0') }}
        </div>
        <button class="bg-blue-300 rounded-full px-8 h-12 py-3 flex items-center shadow-md" v-if="!isYourTurn"
                @click="requestTimeout">Request victory by timeout
        </button>
        <div v-if="diceThrown" :class="[
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
        ]">
          <DieFace v-for="(die, index) in availableDice" :key="index" :value="die" />
        </div>
      </div>
      <div class="messages absolute p-8 flex flex-col-reverse" v-if="started">
        <div v-for="message in messages" :key="message.id"
             :class="['message', message.user === username ? 'your-message' : 'opponent-message']">
          {{ message.message }}
        </div>
      </div>
      <div class="flex gap-2 mt-4 flex-wrap" v-if="configuration && started">
        <button v-if="isYourTurn&&diceThrown"
                class="btn-pass-turn py-2.5 px-4 shadow-md rounded-l-full rounded-r-full bg-yellow-600 hover:bg-yellow-700 text-white cursor-pointer"
                @click="getAISuggestion">Get AI Suggestion {{ ai_suggestions[isPlayer1 ? 1 : 0] }}/3
        </button>
        <div>
          <button v-if="showPassButton && isYourTurn&&diceThrown"
                  class="btn-pass-turn py-2.5 px-4 shadow-md rounded-l-full rounded-r-full bg-yellow-600 text-white cursor-pointer" @click="passTheTurn()">
            Pass the turn
          </button>
        </div>
      </div>
      <div class="z-10 absolute bottom-4 right-4 bg-slate-200 border-2 max-w-[500px] rounded-md shadow-md" v-if="configuration && started && showMessages">
        <button @click.stop="showMessages=false" class="absolute top-0 right-0 m-2 text-black x-receive-invites">
          <v-icon name="io-close-sharp" scale="1.5" />
        </button>
        <div class="flex flex-wrap mt-7 gap-2 p-4 items-center justify-center">
          <button v-for="msg in preformedMessages" :key="msg"
                class="btn-preformed p-2 rounded bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                @click.stop="sendPreformedMessage(msg)">
          {{ msg }}
        </button>
        </div>
      </div>
      <button class="absolute bottom-4 right-4 py-3 px-5 mb-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600" @click.stop="showMessages=true" v-if="configuration && started">
        <v-icon name="bi-chat-dots-fill" scale="1.5"/>
      </button>
    </div>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" v-if="doublingCube.proposed">
      <div class="bg-white p-10 rounded-lg shadow-lg">
      <span v-if="isYourTurn" class="text-lg font-semibold text-gray-600">
        Waiting for opponent to accept or reject the double...
      </span>
        <div v-else>
        <span class="text-lg font-semibold text-gray-600">
        The opponent has proposed a double. Do you accept?
      </span>
          <div class="flex w-full justify-center items-center gap-2 mt-8">
            <button class="btn-accept px-6 py-2 rounded bg-green-600 text-white cursor-pointer"
                    @click.stop="acceptDoubling">Accept
            </button>
            <button class="btn-reject px-6 py-2 rounded bg-red-600 text-white cursor-pointer"
                    @click.stop="rejectDoubling">Reject
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2 absolute top-4 left-4">
      <button @click="goHome" id="home-btn"
            class="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-400">
      <v-icon
        name="io-home-sharp" />
    </button>

    <button
          class="py-2 px-4 bg-red-500 text-white rounded shadow-md hover:bg-red-600"
          @click="isModalVisible = true">
          <v-icon name="md-exittoapp"/>
  </button>
    </div>
  </div>
</template>

<script lang="ts">
import DieFace from '@/components/DieFace.vue'
import { computed, defineComponent, ref } from 'vue'
import axiosInstance from '@/axios'
import GameBoard from '@/components/GameBoard.vue'
import { BoardConfiguration } from '@/models/BoardConfiguration'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import { useWsStore } from '@/stores/wsStore'
import { useAuthStore } from '@/stores/authStore'
import { isAxiosError } from 'axios'
import { isBackgammon, isGammon } from '@/services/gameService'
import QuitModal from '@/components/QuitModal.vue'

export default defineComponent({
  name: 'GameView',
  components: {
    QuitModal,
    GameBoard,
    DieFace
  },
  setup() {
    const gameStore = useGameStore()
    const {
      turn,
      dice,
      boardConfiguration,
      player1,
      player2,
      rounds_to_win,
      winsP1,
      winsP2,
      status,
      starter,
      startDice,
      ai_suggestions,
      doublingCube,
      last_updated
    } = storeToRefs(gameStore)

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


    const preformedMessages = ['Ottima mossa! 👍', 'Per poco! 😅', 'Buona fortuna! 🍀', 'Oops 😬', 'È il tuo turno! ⏳', 'Che peccato! 😢']

    const sendPreformedMessage = async (message: string) => {
      try {
        await axiosInstance.post('/game/message', { message })
      } catch (error) {
        if (isAxiosError(error)) {
          useWsStore().addError(error?.response?.data?.detail)
        }
      }
    }

    const started = starter.value > 0
    const ai_names = ['ai_easy', 'ai_medium', 'ai_hard']

    const passTheTurn = async () => {
      showPassButton.value = false
      try {
        await axiosInstance.post('/game/pass_turn')
      } catch (error) {
        if (isAxiosError(error)) {
          useWsStore().addError(error?.response?.data?.detail)
        }
      }
    }

    const showPassButton = ref()
    const buttonShower = () => {
      showPassButton.value = true
    }

    const requestTimeout = async () => {
      try {
        await axiosInstance.post('/game/request_timeout')
      } catch (error) {
        if (isAxiosError(error)) {
          useWsStore().addError(error?.response?.data?.detail)
        }
      }
    }

    const remainingTime = ref(30)

    const updateRemainingTime = () => {
      const lastUpdated = new Date(last_updated.value)
      const currentTime = new Date()
      const timeoutDuration = 30 * 1000 // 30 seconds
      const timeElapsed = currentTime.getTime() - lastUpdated.getTime()
      const timeLeft = timeoutDuration - timeElapsed
      remainingTime.value = timeLeft > 0 ? Math.ceil(timeLeft / 1000) : 0
      if (remainingTime.value > 0) {
        setTimeout(updateRemainingTime, 1000)
      }
    }

    const isModalVisible = ref(false)
    const confirmQuit = async () => {
      isModalVisible.value = false
      try {
        await axiosInstance.post('/game/quit')
      } catch (error) {
        if (isAxiosError(error)) {
          useWsStore().addError(error?.response?.data?.detail)
        }
      }
    }

    const cancelQuit = () => {
      isModalVisible.value = false
    }

    const getAISuggestion = () => {
      gameStore.getAISuggestions(player1.value == username)
    }

    const showMessages = ref(false);

    return {
      configuration: computed(() => boardConfiguration.value),
      thrower: computed(() => (turn.value % 2) + 1),
      diceResult: {
        die1: computed(() => (dice.value.roll.length > 0 ? dice.value.roll[0] : null)),
        die2: computed(() => (dice.value.roll.length > 1 ? dice.value.roll[1] : null))
      },
      availableDice: computed(() => dice.value.available),
      startDice: computed(() => startDice.value),
      starter,
      player1,
      player2,
      turn,
      rounds_to_win,
      winsP1,
      winsP2,
      messages,
      username,
      preformedMessages,
      sendPreformedMessage,
      showPassButton,
      requestTimeout,
      buttonShower,
      passTheTurn,
      started: ref(started),
      initialText: 'Throw the die to pick the starter!',
      status,
      ai_names,
      gameOver: computed(() => status.value === 'player_1_won' || status.value === 'player_2_won'),
      isModalVisible,
      confirmQuit,
      cancelQuit,
      getAISuggestion,
      ai_suggestions,
      doublingCube,
      remainingTime,
      last_updated,
      updateRemainingTime,
      showMessages
    }
  },
  methods: {
    formatWinMessage(winnerUsername: string, winnerIsPlayer1: boolean, board: BoardConfiguration) {
      let opt = ''
      if (isBackgammon(board, winnerIsPlayer1))
        opt = ' with a backgammon'
      else if (isGammon(board, winnerIsPlayer1))
        opt = ' with a gammon'
      return `${winnerUsername} has won the match${opt}!`
    },
    goHome() {
      this.$router.push({ name: 'home' })
    },
    async diceThrow() {
      this.showPassButton = false
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
        .post('/move/piece', {
          board,
          dice
        })
        .catch(error => {
          if (isAxiosError(error)) {
            useWsStore().addError(error?.response?.data?.detail)
          }
        })
    },
    getGameOverShareText() {
      if (this.isPlayer1 && this.status === 'player_1_won') {
        return `I just won a game of backgammon against ${this.player2}! 🏆 Play now!`
      } else if (!this.isPlayer1 && this.status === 'player_2_won') {
        return `I just won a game of backgammon against ${this.player1}! 🏆 Play now!`
      } else if (this.isPlayer1 && this.status === 'player_2_won') {
        return `I just lost a game of backgammon against ${this.player2}! 😢 Help me out, play now!`
      } else {
        return `I just lost a game of backgammon against ${this.player1}! 😢 Help me out, play now!`
      }
    }, async shareOnWhatsApp() {
      const url = `https://wa.me/?text=${encodeURIComponent(this.getGameOverShareText())}`
      window.open(url, '_blank')
    },
    async shareOnTwitter() {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.getGameOverShareText())}`
      window.open(url, '_blank')
    },
    async shareOnFacebook() {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
      window.open(url, '_blank')
    },
    startPlaying() {
      this.started = true
    },
    throwStartDice() {
      axiosInstance
        .get('/throw_start_dice')
        .catch(error => {
          if (isAxiosError(error)) {
            useWsStore().addError(error?.response?.data?.detail)
          }
        })
    },
    proposeDoubling() {
      axiosInstance
        .post('/game/double/propose')
        .catch(error => {
          if (isAxiosError(error)) {
            useWsStore().addError(error?.response?.data?.detail)
          }
        })
    },
    acceptDoubling() {
      axiosInstance
        .post('/game/double/accept')
        .catch(error => {
          if (isAxiosError(error)) {
            useWsStore().addError(error?.response?.data?.detail)
          }
        })
    },
    rejectDoubling() {
      axiosInstance
        .post('/game/double/reject')
        .catch(error => {
          if (isAxiosError(error)) {
            useWsStore().addError(error?.response?.data?.detail)
          }
        })
    }
  },
  computed: {
    isYourTurn(): boolean {
      return (this.turn % 2 === 0 && this.isPlayer1) || (this.turn % 2 === 1 && !this.isPlayer1)
    },
    diceThrown(): boolean {
      return this.diceResult.die1.value !== null && this.diceResult.die2.value !== null
    },
    isPlayer1(): boolean {
      return this.username === this.player1
    },
    startDiceThrowAllowed(): boolean {
      return this.starter <= 0 && this.isPlayer1 && this.startDice.count1 <= this.startDice.count2
        || this.starter <= 0 && !this.isPlayer1 && this.startDice.count2 <= this.startDice.count1
    },
    canDouble() {
      const maxDouble = 3
      const playerNumber = this.isPlayer1 ? 1 : 2
      const opponentUsername = this.isPlayer1 ? this.player2 : this.player1

      console.log(opponentUsername)
      console.log(this.ai_names.includes(opponentUsername))

      console.log(this.doublingCube.last_usage)

      return this.isYourTurn && !this.diceThrown && this.doublingCube.last_usage != playerNumber && this.doublingCube.count < maxDouble
        && !this.doublingCube.proposed && !this.ai_names.includes(opponentUsername)
    },
    diceThrowAllowed() {
      return this.isYourTurn && !this.diceThrown && !this.doublingCube.proposed
    },
    winnerMessage(): string {
      if (this.status === 'player_1_won') {
        return this.formatWinMessage(this.player1, true, this.configuration)
      } else if (this.status === 'player_2_won') {
        return this.formatWinMessage(this.player2, false, this.configuration)
      }
      return ''
    }
  },
  watch: {
    starter(newVal, oldVal) {
      if (oldVal === -1 && newVal > 0)
        this.started = true
      else if (newVal === 1 && this.isPlayer1 || newVal === 2 && !this.isPlayer1)
        this.initialText = 'You start!'
      else if (newVal === 1 && !this.isPlayer1 || newVal === 2 && this.isPlayer1)
        this.initialText = `Opponent starts!`
    },
    winsP1(newVal, oldVal) {
      (newVal >= this.rounds_to_win) && this.$router.push({
        name: 'match-over',
        props: { player1: this.player1, player2: this.player2 }
      })
    },
    winsP2(newVal, oldVal) {
      (newVal >= this.rounds_to_win) && this.$router.push({
        name: 'match-over',
        props: { player1: this.player1, player2: this.player2 }
      })
    },
    last_updated() {
      this.updateRemainingTime()
    }
  }
})
</script>

<style>
.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

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

.start-button {
  aspect-ratio: 1;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d55;
}

.start-pulse {
  animation: start-pulse 2s infinite;
}

@keyframes dice-pulse {

  0%,
  100% {
    transform: translateX(-50%) scale(1);
  }

  50% {
    transform: translateX(-50%) scale(1.25);
  }
}

@keyframes start-pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.25);
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
