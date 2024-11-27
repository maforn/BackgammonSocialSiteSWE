import { flushPromises, mount } from '@vue/test-utils'
import { beforeAll, describe, it, expect, vi, afterEach } from 'vitest';
import LeaderboardView from '@/views/LeaderboardView.vue';
import axiosInstance from '@/axios';
import MockAdapter from 'axios-mock-adapter';
import { createPinia, setActivePinia } from 'pinia';
import router from '@/router'

vi.mock('@/router', () => ({
  push: vi.fn(),
  default: { push: vi.fn() }
}));

describe('LeaderboardView.vue', () => {
  let mock: MockAdapter;
  const pinia = createPinia();

  beforeAll(() => {
    mock = new MockAdapter(axiosInstance);
    setActivePinia(pinia);
  });

  afterEach(() => {
    mock.reset();
  });

  it('renders correctly with initial data', async () => {
    mock.onGet('/users/top5_and_me').reply(200, [
      { _id: '1', username: 'user1', rating: 100, position: 1 },
      { _id: '2', username: 'user2', rating: 90, position: 2 },
      { _id: '3', username: 'user3', rating: 80, position: 3 },
      { _id: '4', username: 'user4', rating: 70, position: 4 },
      { _id: '5', username: 'user5', rating: 60, position: 5 },
      { _id: '6', username: 'myuser', rating: 50, position: 6 }
    ]);

    const wrapper = mount(LeaderboardView, {
      global: {
        plugins: [pinia]
      }
    });


    await flushPromises();


    expect(wrapper.find('h1').text()).toBe('LEADERBOARD');
    expect(wrapper.vm.usersData.length).toBe(6);
    expect(wrapper.vm.usersData[0].username).toBe('user1');
  });

  it('calls goHome method and navigates to home', async () => {
    const wrapper = mount(LeaderboardView, {
      global: {
        plugins: [pinia, router]
      }
    });

    await wrapper.find('#home-btn').trigger('click');
    expect(router.push).toHaveBeenCalledWith({ name: 'home' });
  });
});
