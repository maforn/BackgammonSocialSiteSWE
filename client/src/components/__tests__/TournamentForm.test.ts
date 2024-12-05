import { mount } from '@vue/test-utils';
import TournamentForm from '../TournamentForm.vue';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { createTournament } from '@/services/tournamentService';
import { useAuthStore } from '@/stores/authStore';
import axiosInstance from '@/axios';

vi.mock('@/services/tournamentService');
vi.mock('@/stores/authStore');
vi.mock('@/axios');

describe('TournamentForm.vue', () => {
    const mockUsername = 'testuser';
    const mockParticipants = [mockUsername];

    beforeEach(() => {
        vi.resetAllMocks();
        (useAuthStore as unknown as Mock).mockReturnValue({ username: mockUsername });
    });

    it('renders the form correctly', () => {
        const wrapper = mount(TournamentForm);
        expect(wrapper.find('form').exists()).toBe(true);
        expect(wrapper.find('input[type="text"]').exists()).toBe(true);
        expect(wrapper.find('select').exists()).toBe(true);
        expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
        expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    });

    it('initializes with the correct default data', () => {
        const wrapper = mount(TournamentForm);
        expect(wrapper.vm.tournamentName).toBe('');
        expect(wrapper.vm.openToEveryone).toBe(false);
        expect(wrapper.vm.roundsToWin).toBe(1);
        expect(wrapper.vm.participants).toEqual(mockParticipants);
    });

    it('enables the create button when conditions are met', async () => {
        const wrapper = mount(TournamentForm);
        await wrapper.setData({ openToEveryone: true });
        expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined();
    });

    it('disables the create button when conditions are not met', async () => {
        const wrapper = mount(TournamentForm);
        await wrapper.setData({ openToEveryone: false, participants: [mockUsername] });
        expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined();
    });

    it('calls createTournament method on form submit', async () => {
        const wrapper = mount(TournamentForm);
        const createTournamentMock = vi.fn();
        wrapper.vm.createTournament = createTournamentMock;
        await wrapper.find('form').trigger('submit.prevent');
        expect(createTournamentMock).toHaveBeenCalled();
    });

    it('fetches users based on search query', async () => {
        const wrapper = mount(TournamentForm);
        const mockUsers = [{ id: 1, username: 'user1' }, { id: 2, username: 'user2' }];
        (axiosInstance.get as Mock).mockResolvedValue({ data: mockUsers });

        await wrapper.setData({ searchQuery: 'user' });
        await wrapper.vm.fetchUsers();
        expect(wrapper.vm.users).toEqual(mockUsers);
    });

    it('selects a user from the dropdown', async () => {
        const wrapper = mount(TournamentForm);
        const mockUser = { id: 1, username: 'user1' };
        await wrapper.setData({ users: [mockUser], searchQuery: 'user' });
        await wrapper.vm.selectUser(mockUser);
        expect(wrapper.vm.participants).toContain(mockUser.username);
        expect(wrapper.vm.searchQuery).toBe('');
        expect(wrapper.vm.showDropdown).toBe(false);
    });

    it('creates a tournament with correct data', async () => {
        const wrapper = mount(TournamentForm);
        const mockTournament = { id: 1, name: 'Test Tournament' };
        (createTournament as Mock).mockResolvedValue(mockTournament);

        await wrapper.setData({
            tournamentName: 'Test Tournament',
            openToEveryone: true,
            participants: mockParticipants,
            roundsToWin: 2,
        });

        await wrapper.vm.createTournament(new Event('submit'));
        expect(createTournament).toHaveBeenCalledWith('Test Tournament', true, mockParticipants, 2, 'round_robin');
        expect(wrapper.emitted().createdTournament[0]).toEqual([mockTournament]);
    });
});

