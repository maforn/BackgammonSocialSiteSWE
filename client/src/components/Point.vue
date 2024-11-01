<template>
    <button class="point h-full">
        <div class="point-container">
            <v-icon name="io-triangle-sharp" viewBox="20 32 472 432" width="100%" height="100%"
                preserveAspectRatio="none" :fill="index % 2 === 0 ? 'white' : 'rgb(75, 85, 99)'"/>
            <span class="pieces-container">
                <!-- If there are too many pieces for player 1, display a single bug one with a number indicator -->
                <div v-if="configuration.player1 > 0 && aboveMaxPieces" :class="['large-piece', 'player-1', { 'rotate-180': upperPoint }]">
                    {{ configuration.player1 }}
                </div>
                <!-- Otherwise, display individual pieces -->
                <div v-else v-for="i in configuration.player1" :key="i" class="piece player-1"></div>

                <!-- If there are too many pieces for player 2, display a single bug one with a number indicator -->
                <div v-if="configuration.player2 > 0 && aboveMaxPieces" :class="['large-piece', 'player-2', { 'rotate-180': upperPoint }]">
                    {{ configuration.player2 }}
                </div>
                <!-- Otherwise, display individual pieces -->
                <div v-else v-for="i in configuration.player2" :key="i" class="piece player-2"></div>
            </span>
        </div>
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { PointConfiguration } from '@/models/BoardConfiguration';

export default defineComponent({
    name: 'Point',
    props: {
        configuration: {
            type: Object as () => PointConfiguration,
            required: true
        },
        upperPoint: {
            type: Boolean,
            default: false
        },
        index: {
            type: Number,
            required: true
        }
    },
    data() {
        return {

        };
    },
    computed: {
        // Check if the number of pieces is above the maximum that can be displayed in the point
        aboveMaxPieces(): boolean {
            return this.configuration.player1 + this.configuration.player2 > 5;
        } 
    }
});
</script>

<style scoped>
.point-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.pieces-container {
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    width: 100%;
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: end;
    gap: 0.125rem;
}

.piece, .large-piece {
    aspect-ratio: 1;
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
}

.piece {
    width: 55%;
}

.large-piece {
    width: 65%;
}

.player-1 {
    background-color: #ff9797;
}

.player-2 {
    background-color: #a1a1ff;
}
</style>