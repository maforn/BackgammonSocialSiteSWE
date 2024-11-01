<template>
    <div class="board bg-gray-300">
        <!-- Left part of the board -->
        <div class="bin">
            <!-- Upper row -->
            <div class="row rotate-180">
                <Point v-for="(pointConf, index) in configuration.points.slice(12, 18)" :key="index" :configuration="pointConf" :index="index" :upperPoint="true"/>
            </div>
            <!-- Lower row -->
            <div class="row">
                <Point v-for="(pointConf, index) in configuration.points.slice(6, 12)" :key="index" :configuration="pointConf" :index="index"/>
            </div>
        </div>

        <!-- Middel bar -->
        <div id="bar" class="flex flex-col items-center justify-center gap-2">
            <div v-if="internalConfiguration.bar.player1 > 0" class="bar-piece player-1 font-bold">
                {{ internalConfiguration.bar.player1 }}
            </div>
            <div v-if="internalConfiguration.bar.player2 > 0" class="bar-piece player-2 font-bold">
                {{ internalConfiguration.bar.player2 }}
            </div>
        </div>

        <!-- Right part of the board -->
        <div class="bin">
            <!-- Upper row -->
            <div class="row rotate-180">
                <Point v-for="(pointConf, index) in configuration.points.slice(18, 24)" :key="index" :configuration="pointConf" :index="index" :upperPoint="true"/>
            </div>
            <!-- Lower row -->
            <div class="row">
                <Point v-for="(pointConf, index) in configuration.points.slice(0, 6)" :key="index" :configuration="pointConf" :index="index"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BoardConfiguration } from '@/models/BoardConfiguration';
import Point from './Point.vue';

export default defineComponent({
    name: 'Board',
    components: {
        Point
    },
    props: {
        configuration: {
            type: Object as () => BoardConfiguration,
            required: true
        }
    },
    data() {
        return {
            // Copy the configuration to an internal one to avoid modifying the original
            internalConfiguration: {} as BoardConfiguration
        };
    },
    created() {
        this.internalConfiguration = { ...this.configuration };
    },
    methods: {
        
    }
});
</script>

<style>
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

.bar-piece{
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