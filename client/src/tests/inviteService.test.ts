import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axiosInstance from '@/axios';
import { getRandomOpponentService } from '@/services/invitesService';
import { useAuthStore } from '@/stores/authStore';
import { setActivePinia, createPinia } from 'pinia';
import { useWsStore } from '@/stores/wsStore'

describe('getRandomOpponentService', () => {
  let mock: MockAdapter;

   beforeAll(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    mock = new MockAdapter(axiosInstance);
    const authStore = useAuthStore();
    authStore.$patch({ username: 'current_user' });
  });

  afterEach(() => {
    mock.reset();
  });

  it('returns a random opponent username', async () => {
    const users = [
      { username: 'user1' },
      { username: 'user2' },
      { username: 'current_user' }
    ];

    mock.onGet('/users/').reply(200, users);

    const opponent = await getRandomOpponentService();
    expect(opponent).to.be.oneOf(['user1', 'user2']);
  });

  it('throws an error if no other users are found', async () => {
    const users = [{ username: 'current_user' }];

    mock.onGet('/users/').reply(200, users);

    await getRandomOpponentService();
    expect(useWsStore().errors.length).toBe(1);
  });
});
