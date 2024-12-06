import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import QuitModal from '../QuitModal.vue';

describe('QuitModal.vue', () => {
	it('renders correctly', () => {
		const wrapper = mount(QuitModal);
		expect(wrapper.exists()).toBe(true);
	});
});
