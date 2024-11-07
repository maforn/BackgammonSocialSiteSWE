import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import NotificationComponent from '../NotificationComponent.vue';

describe('NotificationComponent.vue', () => {
	it('renders correctly with a given message', () => {
		const message = 'This is an error message';
		const wrapper = mount(NotificationComponent, {
			props: { message },
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('displays the correct message', () => {
		const message = 'This is an error message';
		const wrapper = mount(NotificationComponent, {
			props: { message },
		});
		expect(wrapper.text()).toContain(message);
	});
});
