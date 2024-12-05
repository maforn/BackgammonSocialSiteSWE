import { mount } from '@vue/test-utils';
import { beforeAll, afterEach, describe, expect, it, vi } from 'vitest';
import PlayHumanView from '../views/PlayHumanView.vue';
import MockAdapter from 'axios-mock-adapter';
import axiosInstance from '@/axios';
import { createPinia, setActivePinia } from 'pinia';
import router from '@/router'
import { getGoogleContactsEmails, sendInviteService, getRandomOpponentService } from '@/services/invitesService';
import { debounce } from 'lodash';

vi.mock('@/services/invitesService', () => ({
	getGoogleContactsEmails: vi.fn(),
	sendInviteService: vi.fn(),
	getRandomOpponentService: vi.fn()
  }));

  vi.mock('lodash', () => ({
	debounce: vi.fn((fn) => fn)
  }));

describe('PlayHumanView.vue', () => {
	let mock: InstanceType<typeof MockAdapter>;;
	const pinia = createPinia();

	beforeAll(() => {
		mock = new MockAdapter(axiosInstance);
		setActivePinia(pinia);
	});

	afterEach(() => {
		mock.reset();
	});

	it('renders the view', () => {
		const wrapper = mount(PlayHumanView);
		expect(wrapper.exists()).toBe(true);
	});

	it('displays the input to select the number of rounds to win', () => {
		const wrapper = mount(PlayHumanView);
		const roundsSelect = wrapper.find('#rounds_to_win');
		expect(roundsSelect.exists()).toBe(true);
	});

	it('displays the button to challenge a random opponent', () => {
		const wrapper = mount(PlayHumanView);
		const challengeRandomButton = wrapper.find('#random-btn');
		expect(challengeRandomButton.exists()).toBe(true);
	});

	it('disables the invite button initially', () => {
		const wrapper = mount(PlayHumanView);
		const inviteButton = wrapper.find('#invite-btn');
		expect(inviteButton.attributes('disabled')).toBeDefined();
	});

	it('enables the invite button when a user is selected', async () => {
		const wrapper = mount(PlayHumanView);
		await wrapper.setData({ searchQuery: 'testuser', users: [{ id: 1, username: 'testuser' }], showDropdown: true });
		wrapper.vm.selectUser({ username: 'testuser' });
		await wrapper.vm.$nextTick();
		const inviteButton = wrapper.find('#invite-btn');
		expect(inviteButton.attributes('disabled')).toEqual('');
	});

	it('does not fetch users when input length is less than 2', async () => {
		const wrapper = mount(PlayHumanView);
		const fetchUsersSpy = vi.spyOn(wrapper.vm, 'fetchUsers');
		await wrapper.setData({ searchQuery: 't' });
		wrapper.vm.onInput();
		await wrapper.vm.$nextTick();
		expect(fetchUsersSpy).not.toHaveBeenCalled();
	});

	it('displays dropdown when users are fetched', async () => {
		const wrapper = mount(PlayHumanView);
		mock.onGet('/users/search').reply(200, [{ id: 1, username: 'testuser' }]);
		await wrapper.setData({ searchQuery: 'test' });
		await wrapper.vm.fetchUsers();
		expect(wrapper.vm.showDropdown).toBe(true);
	});

	it('hides dropdown when no users are fetched', async () => {
		const wrapper = mount(PlayHumanView);
		mock.onGet('/users/search').reply(200, []);
		await wrapper.setData({ searchQuery: 'test' });
		await wrapper.vm.fetchUsers();
		expect(wrapper.vm.showDropdown).toBe(false);
	});

  it('fetches Google friends when switch is toggled', async () => {
    const wrapper = mount(PlayHumanView);
    const mockEmails = ['friend1@gmail.com', 'friend2@gmail.com'];
    (getGoogleContactsEmails as vi.Mock).mockResolvedValue(mockEmails);

    wrapper.vm.inviteGoogleFriends = true;
    await wrapper.vm.toggleGoogleFriends();

    expect(getGoogleContactsEmails).toHaveBeenCalled();
    expect(wrapper.vm.emails).toEqual(mockEmails);
  });

  it('selects a Google friend from the dropdown', async () => {
    const wrapper = mount(PlayHumanView);
    const mockEmails = ['friend1@gmail.com', 'friend2@gmail.com'];
    await wrapper.setData({ inviteGoogleFriends: true, emails: mockEmails, searchQuery: 'friend', showDropdown: true });

    wrapper.vm.selectEmail(mockEmails[0]);

    expect(wrapper.vm.searchQuery).toBe(mockEmails[0]);
    expect(wrapper.vm.showDropdown).toBe(false);
    expect(wrapper.vm.hasSelectedOpponent).toBe(true);
  });

  it('calls sendInviteService with correct parameters and resets state', async () => {
    const wrapper = mount(PlayHumanView);
    wrapper.setData({
      searchQuery: 'testuser',
      rounds_to_win: 2,
      inviteGoogleFriends: false,
      hasSelectedOpponent: true
    });

    await wrapper.vm.sendInvite();

    expect(sendInviteService).toHaveBeenCalledWith('testuser', 2, false);
    expect(wrapper.vm.searchQuery).toBe('');
    expect(wrapper.vm.hasSelectedOpponent).toBe(false);
  });

  it('calls getRandomOpponentService and sendInviteService with correct parameters', async () => {
    const wrapper = mount(PlayHumanView);
    (getRandomOpponentService as vi.Mock).mockResolvedValue('randomuser');

    await wrapper.vm.sendRandomInvite();

    expect(getRandomOpponentService).toHaveBeenCalled();
    expect(sendInviteService).toHaveBeenCalledWith('randomuser', wrapper.vm.rounds_to_win, false);
  });
  
  it('should navigate to home on goHome method call', async () => {
	const wrapper = mount(PlayHumanView, {
		global: {
			plugins: [router]
		}
	})
	const goHomeSpy = vi.spyOn(wrapper.vm, 'goHome')
	await wrapper.vm.goHome()
	expect(goHomeSpy).toHaveBeenCalled()
})

it('filters emails based on searchQuery', async () => {
    const wrapper = mount(PlayHumanView);
    await wrapper.setData({
      emails: ['test1@example.com', 'test2@example.com', 'user@example.com'],
      searchQuery: 'test'
    });

    expect(wrapper.vm.filteredEmails).toEqual(['test1@example.com', 'test2@example.com']);

    await wrapper.setData({ searchQuery: 'user' });
    expect(wrapper.vm.filteredEmails).toEqual(['user@example.com']);

    await wrapper.setData({ searchQuery: 'example' });
    expect(wrapper.vm.filteredEmails).toEqual(['test1@example.com', 'test2@example.com', 'user@example.com']);

    await wrapper.setData({ searchQuery: 'nonexistent' });
    expect(wrapper.vm.filteredEmails).toEqual([]);
  });

  it('handles input correctly', async () => {
    const wrapper = mount(PlayHumanView);
    const fetchUsersSpy = vi.spyOn(wrapper.vm, 'fetchUsers');

    await wrapper.setData({ searchQuery: 'a', inviteGoogleFriends: false });
    wrapper.vm.onInput();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.hasSelectedOpponent).toBe(false);
    expect(wrapper.vm.showDropdown).toBe(false);
    expect(fetchUsersSpy).not.toHaveBeenCalled();

    await wrapper.setData({ searchQuery: 'abc', inviteGoogleFriends: false });
    wrapper.vm.onInput();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.hasSelectedOpponent).toBe(false);
    expect(wrapper.vm.showDropdown).toBe(false);
    expect(fetchUsersSpy).toHaveBeenCalled();
  });

});
