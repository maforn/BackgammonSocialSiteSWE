import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeAll } from 'vitest';
import ErrorContainer from '@/components/ErrorContainer.vue';
import NotificationComponent from '@/components/NotificationComponent.vue';
import { setActivePinia, createPinia } from 'pinia';
import { useWsStore } from '@/stores/wsStore';

describe('ErrorContainer.vue', () => {
	const pinia = createPinia();

	beforeAll(() => {
		setActivePinia(pinia);
	});

	it('renders error notifications', () => {
		const wsStore = useWsStore();
		wsStore.addError('Error 1');
		wsStore.addError('Error 2');

		const wrapper = mount(ErrorContainer);

		const errorNotifications = wrapper.findAllComponents(NotificationComponent);
		expect(errorNotifications).toHaveLength(2);
		expect(errorNotifications[0].props('message')).toBe('Error 1');
		expect(errorNotifications[1].props('message')).toBe('Error 2');
	});
});
