<template>
	<div class="die">
		<div v-for="dot in dots" :key="dot" class="dot" :class="dot"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
	name: 'DieFace',
	props: {
		value: {
			type: Number as PropType<number>,
			required: true,
		},
	},
	computed: {
		dots() {
			const dotPositions: { [key: number]: string[] } = {
				1: ['center'],
				2: ['top-left', 'bottom-right'],
				3: ['top-left', 'center', 'bottom-right'],
				4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
				5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
				6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
			};
			return dotPositions[this.value] || [];
		},
	},
});
</script>

<style scoped>
.die {
	height: 100%;
	aspect-ratio: 1;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(3, 1fr);
	background-color: white;
	border: 1px solid black;
	border-radius: 5px;
	position: relative;
}

.dot {
	width: 20%;
	height: 20%;
	background-color: black;
	border-radius: 50%;
	position: absolute;
}

.dot.center {
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.dot.top-left {
	top: 10%;
	left: 10%;
}

.dot.top-right {
	top: 10%;
	right: 10%;
}

.dot.middle-left {
	top: 50%;
	left: 10%;
	transform: translateY(-50%);
}

.dot.middle-right {
	top: 50%;
	right: 10%;
	transform: translateY(-50%);
}

.dot.bottom-left {
	bottom: 10%;
	left: 10%;
}

.dot.bottom-right {
	bottom: 10%;
	right: 10%;
}
</style>
