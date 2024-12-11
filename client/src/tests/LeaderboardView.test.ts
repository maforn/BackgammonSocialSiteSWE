import { flushPromises, mount } from '@vue/test-utils'
import { beforeAll, describe, it, expect, vi, afterEach } from 'vitest';
import LeaderboardView from '@/views/LeaderboardView.vue';
import axiosInstance from '@/axios';
import MockAdapter from 'axios-mock-adapter';
import { createPinia, setActivePinia } from 'pinia';
import router from '@/router'
import { useWsStore } from '@/stores/wsStore'

vi.mock('@/router', () => ({
  push: vi.fn(),
  default: { push: vi.fn() }
}));

function setup(mock) {
  mock.onGet('/users/top5_and_me').reply(200, [
    { _id: '1', username: 'user1', rating: 100, position: 1 },
    { _id: '2', username: 'user2', rating: 90, position: 2 },
    { _id: '3', username: 'user3', rating: 80, position: 3 },
    { _id: '4', username: 'user4', rating: 70, position: 4 },
    { _id: '5', username: 'user5', rating: 60, position: 5 },
    { _id: '6', username: 'myuser', rating: 50, position: 6 }
  ])
}

describe('LeaderboardView.vue', () => {
  let mock: InstanceType<typeof MockAdapter>;;
  const pinia = createPinia();

  beforeAll(() => {
    mock = new MockAdapter(axiosInstance);
    setActivePinia(pinia);
  });

  afterEach(() => {
    mock.reset();
  });

  it('renders correctly with initial data', async () => {
    setup(mock)

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

  it('toggles to Google friends leaderboard', async () => {
    mock.onPost('/users/top5_and_me_google').reply(200, [
      { _id: '1', username: 'googleuser1', rating: 100, position: 1 },
      { _id: '2', username: 'googleuser2', rating: 90, position: 2 },
      { _id: '3', username: 'googleuser3', rating: 80, position: 3 },
      { _id: '4', username: 'googleuser4', rating: 70, position: 4 },
      { _id: '5', username: 'googleuser5', rating: 60, position: 5 },
      { _id: '6', username: 'myuser', rating: 50, position: 6 }
    ]);

    const wrapper = mount(LeaderboardView, {
      global: {
        plugins: [pinia]
      }
    });

    wrapper.vm.showGoogleFriends = true;
    await wrapper.vm.toggleGoogleFriends();
    await flushPromises();

    expect(wrapper.vm.usersData[0].username).toBe('googleuser1');
  });

  it('handles error with normal leaderboard', async () => {
    mock.onGet('/users/top5_and_me').reply(500, { detail: 'Error' });

    const wrapper = mount(LeaderboardView, {
      global: {
        plugins: [pinia]
      }
    });

    wrapper.vm.showGoogleFriends = false;
    await wrapper.vm.toggleGoogleFriends();
    expect(useWsStore().errors[0].message).toBe('Error');
  })

  it('handles error when toggling to Google friends leaderboard', async () => {
    mock.onPost('/users/top5_and_me_google').reply(500, { detail: 'Error' });

    const wrapper = mount(LeaderboardView, {
      global: {
        plugins: [pinia]
      }
    });

    wrapper.vm.showGoogleFriends = true;
    wrapper.vm.toggleGoogleFriends();
    expect(useWsStore().errors[0].message).toBe('Error');
  })

  it('toggles to leaderboard', async () => {
    setup(mock)

    const wrapper = mount(LeaderboardView, {
      global: {
        plugins: [pinia]
      }
    });

    wrapper.vm.showGoogleFriends = false;
    await wrapper.vm.$nextTick();
    await wrapper.vm.toggleGoogleFriends();
    await flushPromises();

    expect(wrapper.vm.usersData[0].username).toBe('user1');
  });
});
