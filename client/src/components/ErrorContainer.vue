<template>
	<div class="fixed bottom-4 left-1/2 transform -translate-x-1/2">
		<div v-for="error in errors" :key="error.id" class="mt-2 transition-opacity">
			<NotificationComponent color="bg-red-500" :message="error.message" />
		</div>
		<div v-for="notification in notifications" :key="notification.id" class="mt-2 transition-opacity">
			<NotificationComponent color="bg-green-500" :message="notification.message" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useWsStore } from '@/stores/wsStore';
import NotificationComponent from '@/components/NotificationComponent.vue';

export default defineComponent({
	name: 'ErrorContainer',
	components: { NotificationComponent },
	setup() {
		const wsStore = useWsStore();
		const { errors, notifications } = storeToRefs(wsStore);

		return {
			errors,
			notifications,
		};
	},
});
</script>
