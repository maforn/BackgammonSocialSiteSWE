<template>
  <div class="board bg-gray-300" @click.stop="deselectPoint">
    <!-- Left part of the board -->
    <div class="bin">
      <!-- Upper row -->
      <div class="row rotate-180">
        <Point
          v-for="(pointConf, index) in internalConfig.points.slice(12, 18)"
          :key="index"
          :configuration="pointConf"
          :isEven="index % 2 === 0"
          :upperPoint="true"
          :available="allowedPointIndices.includes(index + 12)"
          :selected="srcPointIndex === index + 12"
          @select-point="selectPoint(index + 12)"
        />
      </div>
      <!-- Lower row -->
      <div class="row">
        <PointComponent
          v-for="(pointConf, index) in internalConfig.points.slice(6, 12)"
          :key="index"
          :configuration="pointConf"
          :isEven="index % 2 === 0"
          :available="allowedPointIndices.includes(index + 6)"
          :selected="srcPointIndex === index + 6"
          @select-point="selectPoint(index + 6)"
        />
      </div>
    </div>

    <!-- Middel bar -->
    <div id="bar" class="flex flex-col items-center justify-center gap-4">
      <div
        v-if="internalConfig.bar.player1 > 0"
        :class="['bar-piece', 'player-1', 'font-bold', { 'animate-pulse': allowedPointIndices.length > 0 }]"
      >
        {{ internalConfig.bar.player1 }}
      </div>
      <div v-if="internalConfig.bar.player2 > 0" class="bar-piece player-2 font-bold">
        {{ internalConfig.bar.player2 }}
      </div>
    </div>

    <!-- Right part of the board -->
    <div class="bin">
      <!-- Upper row -->
      <div class="row rotate-180">
        <PointComponent
          v-for="(pointConf, index) in internalConfig.points.slice(18, 24)"
          :key="index"
          :configuration="pointConf"
          :isEven="index % 2 === 0"
          :upperPoint="true"
          :available="allowedPointIndices.includes(index + 18)"
          :selected="srcPointIndex === index + 18"
          @select-point="selectPoint(index + 18)"
        />
      </div>
      <!-- Lower row -->
      <div class="row">
        <PointComponent
          v-for="(pointConf, index) in internalConfig.points.slice(0, 6)"
          :key="index"
          :configuration="pointConf"
          :isEven="index % 2 === 0"
          :available="allowedPointIndices.includes(index)"
          :selected="srcPointIndex === index"
          @select-point="selectPoint(index)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { BoardConfiguration } from '@/models/BoardConfiguration'
import PointComponent from './PointComponent.vue'
import axiosInstance from '@/axios'
import { useWsStore } from '@/stores/wsStore'
import { isAxiosError } from 'axios'

export default defineComponent({
  name: 'GameBoard',
  components: {
    PointComponent
  },
  props: {
    configuration: {
      type: BoardConfiguration,
      required: true
    },
    player1: {
      type: Boolean,
      default: true
    },
    dices: {
      type: Array as () => number[],
      required: true
    },
    yourTurn: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      /* Copy of the displayed configuration */
      internalConfig: {} as BoardConfiguration,

      /* Dices available to the player */
      availableDices: null as number[] | null,

      /* Index of the point the player wants to move pieces from */
      srcPointIndex: null as number | null
    }
  },
  created() {
    this.internalConfig = this.player1 ? { ...this.configuration } : this.swapPlayers(this.configuration)
  },
  watch: {
    dices(newDices) {
      this.availableDices = [...newDices]
    },
    configuration(newConfig) {
      this.internalConfig = this.player1 ? { ...newConfig } : this.swapPlayers(newConfig)
    }
  },
  methods: {
    /**
     * Selects a point to move pieces from or to.
     * @param index Index of the selected point.
     */
    selectPoint(index: number) {
      if (this.internalConfig.bar.player1 > 0) {
        this.movePiece(24, index) // Move piece from bar to point
      } else if (!this.srcPointIndex) {
        this.srcPointIndex = index
        console.log('Selected point', index)
      } else {
        this.movePiece(this.srcPointIndex, index) // Move piece from one point to another
      }
    },
    /**
     * Deselects the currently selected point.
     */
    deselectPoint() {
      console.log('Deselected point')
      this.srcPointIndex = null
    },
    /**
     * Moves a piece from one point to another.
     * @param srcPointIndex Index of the source point (24 for the bar).
     * @param dstPointIndex Index of the destination point.
     */
    movePiece(srcPointIndex: number, dstPointIndex: number) {
      // TODO: Possibly replace all this code with a single API call to move a piece

      this.checkMoveValidity(srcPointIndex, dstPointIndex)

      // Move the piece
      if (srcPointIndex === 24) {
        this.internalConfig.bar.player1--
      } else {
        this.internalConfig.points[srcPointIndex].player1--
      }
      this.internalConfig.points[dstPointIndex].player1++

      // Hit the opponent's piece if there is only one
      if (this.internalConfig.points[dstPointIndex].player2 === 1) {
        this.internalConfig.points[dstPointIndex].player2 = 0
        this.internalConfig.bar.player2++
      }

      // Update the available dices and reset the source point index
      if (this.availableDices && this.availableDices.length > 1 && this.availableDices[0] === this.availableDices[1]) {
        this.availableDices.pop()
      } else {
        this.availableDices =
          this.availableDices?.filter(dice => dice !== Math.abs(srcPointIndex - dstPointIndex)) || null
      }
      this.srcPointIndex = null

      axiosInstance.post('/move_piece', {
        board: this.player1 ? this.internalConfig : this.swapPlayers(this.internalConfig),
        dice: Math.abs(srcPointIndex - dstPointIndex)
      }).catch(error => {if (isAxiosError(error)) {useWsStore().addError((error?.response?.data?.detail))}})

      // Check if the player can still move pieces
      if (!this.availableDices || this.availableDices.length === 0 || this.allowedPointIndices.length === 0) {
        console.log('Dices have been used, switch players')
      }
    },
    /**
     * Check the validity of a move
     * @param srcPointIndex Index of the source point (24 for the bar).
     * @param dstPointIndex Index of the destination point.
     */
    checkMoveValidity(srcPointIndex: number, dstPointIndex: number) {
      if (srcPointIndex > 24 || srcPointIndex < 0 || dstPointIndex > 23 || dstPointIndex < 0)
        throw new Error('Indices are out of range')
      else if (this.internalConfig.bar.player1 >= 1 && srcPointIndex !== 24)
        throw new Error('You should move pieces out of the bar first!')
      else if (dstPointIndex > srcPointIndex) throw new Error('You cannot move to higher points!')
      else if (
        (srcPointIndex === 24 && this.internalConfig.bar.player1 <= 0) ||
        (srcPointIndex < 24 && this.internalConfig.points[srcPointIndex].player1 <= 0)
      )
        throw new Error('You have no pieces to move!')
      else if (!this.allowedPointIndices.includes(dstPointIndex))
        throw new Error('The destination point is not allowed')
    },
    /**
     * Swaps the players on the board. Changes the perspective of the board.
     * @param board Board configuration to swap the players on.
     */
    swapPlayers(board: BoardConfiguration) {
      const newBoard = JSON.parse(JSON.stringify(board))

      // Swap pieces on each point
      for (const point of newBoard.points) {
        const tmp = point.player1
        point.player1 = point.player2
        point.player2 = tmp
      }

      // Invert point order
      newBoard.points = newBoard.points.reverse()

      // Swap pieces in the bar
      const tmpBar = newBoard.bar.player1
      newBoard.bar.player1 = newBoard.bar.player2
      newBoard.bar.player2 = tmpBar

      return newBoard
    }
  },
  computed: {
    /**
     * Returns the indices of the points the player can select in the current stage of the game
     * to move pieces from or to.
     */
    allowedPointIndices() {
      if (!this.availableDices || this.availableDices.length === 0 || !this.yourTurn) {
        // No selection can be done if the dices have not been rolled or it is not you turn
        return []
      } else if (this.internalConfig.bar.player1 > 0) {
        // There are pieces in the bar, return the points where the pieces can be moved to
        return this.availableDices
          .map(dice => 24 - dice)
          .filter(index => index <= 23 && index >= 0 && this.internalConfig.points[index].player2 <= 1)
      } else if (!this.srcPointIndex) {
        // No point has been selected yet, return the points with pieces
        return this.internalConfig.points
          .map((point, index) => (point.player1 >= 1 ? index : -1))
          .filter(index => index !== -1)
      } else {
        // A point has been selected, return the points where the pieces can be moved to
        return this.availableDices
          .map(dice => (this.srcPointIndex ?? 24) - dice)
          .filter(index => index <= 23 && index >= 0 && this.internalConfig.points[index].player2 <= 1)
      }
    }
  }
})
</script>

<style scoped>
.board {
  border: 2em solid rgb(75 85 99);
  display: flex;
}

#bar {
  background-color: rgb(75 85 99);
  min-width: 4em;
}

.bin {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5em;
}

.row {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-around;
  width: 100%;
  aspect-ratio: 2;
}

@media (max-width: 768px) {
  /* Make the board and bar less thick on small screens */
  .board {
    border: 1em solid rgb(75 85 99);
  }

  #bar {
    min-width: 2em;
  }
}

.bar-piece {
  width: 75%;
  aspect-ratio: 1;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-1 {
  background-color: #ff9797;
}

.player-2 {
  background-color: #a1a1ff;
}
</style>
