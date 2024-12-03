import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import App from '@/App.vue';
import { createPinia } from 'pinia';
import router from '@/router';

describe('App.vue', () => {
  it('renders without crashing', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
