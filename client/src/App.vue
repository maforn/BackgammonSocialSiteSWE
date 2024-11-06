<template>
	<router-view></router-view>
	<ErrorContainer />
</template>

<script lang="ts">
import { watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useWsStore } from '@/stores/wsStore';
import ErrorContainer from '@/components/ErrorContainer.vue';

export default {
	name: 'App',
	components: { ErrorContainer },

	setup() {
		watch(
			() => useAuthStore().token,
			newToken => {
				const wsStore = useWsStore();
				if (newToken) {
					wsStore.connect();
				} else {
					wsStore.disconnect();
				}
			},
		);
	},
	mounted() {
		const newToken = useAuthStore().token;
		const wsStore = useWsStore();
		if (newToken) {
			wsStore.connect();
		} else {
			wsStore.disconnect();
		}
	},
};
</script>

<style>
html,
body {
	height: 100%;
	margin: 0;
	padding: 0;
}

body {
	background-color: #e6e6e6; /* Set your desired background color */
}
</style>
