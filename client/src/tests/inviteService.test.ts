import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axiosInstance from '@/axios';
import { sendInviteService, receiveInviteService, acceptInviteService, getGoogleContactsEmails, getRandomOpponentService } from '@/services/invitesService';
import { useAuthStore } from '@/stores/authStore';
import { setActivePinia, createPinia } from 'pinia';
import { useWsStore } from '@/stores/wsStore';
import axios from 'axios'

describe('invite service', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    mock = new MockAdapter(axiosInstance);
    const authStore = useAuthStore();
    authStore.$patch({ username: 'current_user', google_token: 'test_token', token: 'aaa' });
  });

  afterEach(() => {
    mock.reset();
  });

  describe('sendInviteService', () => {
    it('sends an invite successfully', async () => {
      mock.onPost('/invites').reply(200);

      await sendInviteService('opponent', 3, false);

      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toBe('/invites');
    });
  });

  describe('receiveInviteService', () => {
    it('receives invites successfully', async () => {
      const invites = [{ id: 'invite1' }];
      mock.onGet('/invites').reply(200, { pending_invites: invites });

      const result = await receiveInviteService();

      expect(result).toEqual(invites);
    });

    it('handles errors gracefully', async () => {
      mock.onGet('/invites').reply(500, { detail: 'Error' });

      await receiveInviteService();

      expect(useWsStore().errors.length).toBe(1);
    });
  });

  describe('acceptInviteService', () => {
    it('accepts an invite successfully', async () => {
      mock.onPost('/invites/accept').reply(200);

      await acceptInviteService('invite1');

      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toBe('/invites/accept');
    });

    it('handles errors gracefully', async () => {
      mock.onPost('/invites/accept').reply(500, { detail: 'Error' });

      try {
        await acceptInviteService('invite1');
      } catch (error) {
        expect(error.message).toBe('Error');
      }
    });
  });

  describe('getGoogleContactsEmails', () => {
    it('fetches Google contacts emails successfully', async () => {
      const mock = new MockAdapter(axios);
      const contacts = {
        connections: [
          { emailAddresses: [{ value: 'email1@example.com' }] },
          { emailAddresses: [{ value: 'email2@example.com' }] }
        ]
      };
      mock.onGet('https://people.googleapis.com/v1/people/me/connections').reply(200, contacts);

      const emails = await getGoogleContactsEmails();

      expect(emails).toEqual(['email1@example.com', 'email2@example.com']);
    });

    it('returns null if no token is available', async () => {
      const authStore = useAuthStore();
      authStore.$patch({ google_token: null });

      const emails = await getGoogleContactsEmails();

      expect(emails).toBeNull();
    });
  });

  describe('getRandomOpponentService', () => {
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
      expect(useWsStore().errors.length).greaterThan(0);
    });
  });
});
