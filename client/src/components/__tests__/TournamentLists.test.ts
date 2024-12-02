import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import TournamentLists from '@/components/TournamentLists.vue'
import MockAdapter from 'axios-mock-adapter';
import { createPinia, setActivePinia } from 'pinia';
import axiosInstance from '@/axios';

describe('TournamentLists.vue', () => {
    let mock: MockAdapter
    const pinia = createPinia();

    beforeAll(() => {
        mock = new MockAdapter(axiosInstance);
        setActivePinia(pinia);
    });

    afterEach(() => {
        mock.reset();
    });
    it('renders open tournaments', async () => {

        const wrapper = mount(TournamentLists)

        mock.onGet('/tournaments/available').reply(200, [
            { owner: 'user1', participants: ['user1'], confirmed_participants: ['user1'], open: true, name: 'Open Tournament 1', status: 'pending', match_ids: [], rounds_to_win: 1 },
            { owner: 'user2', participants: ['user2'], confirmed_participants: ['user2'], open: true, name: 'Open Tournament 2', status: 'pending', match_ids: [], rounds_to_win: 1 }
        ]);

        await flushPromises();
        expect(wrapper.findAll('button').length).toBe(2)
        expect(wrapper.text()).toContain('Open Tournament 1')
        expect(wrapper.text()).toContain('Open Tournament 2')
    })

    it('renders closed tournaments', async () => {
        const wrapper = mount(TournamentLists)

        mock.onGet('/tournaments/available').reply(200, [
            { owner: 'user1', participants: ['user1, user2, user3, user4'], confirmed_participants: ['user1'], open: false, name: 'Closed Tournament 1', status: 'pending', match_ids: [], rounds_to_win: 1 },
            { owner: 'user2', participants: ['user5, user6, user7, user8'], confirmed_participants: ['user5'], open: false, name: 'Closed Tournament 2', status: 'pending', match_ids: [], rounds_to_win: 1 }
        ]);

        await flushPromises();
        expect(wrapper.findAll('button').length).toBe(2)
        expect(wrapper.text()).toContain('Closed Tournament 1')
        expect(wrapper.text()).toContain('Closed Tournament 2')
    })

    it('shows no open tournaments message', () => {
        const wrapper = mount(TournamentLists, {
            props: {
                openTournaments: [],
                closedTournaments: []
            }
        })
        expect(wrapper.text()).toContain('No open tournaments available.')
    })

    it('shows no closed tournaments message', () => {
        const wrapper = mount(TournamentLists, {
            props: {
                openTournaments: [],
                closedTournaments: []
            }
        })
        expect(wrapper.text()).toContain('No closed tournaments available.')
    })

    it('calls selectTournament when a tournament is clicked', async () => {
        const wrapper = mount(TournamentLists)
        const selectTournamentSpy = vi.spyOn(wrapper.vm, 'selectTournament');

        mock.onGet('/tournaments/available').reply(200, [
            { owner: 'user1', participants: ['user1'], confirmed_participants: ['user1'], open: true, name: 'Open Tournament 1', status: 'pending', match_ids: [], rounds_to_win: 1 },
            { owner: 'user2', participants: ['user2'], confirmed_participants: ['user2'], open: true, name: 'Open Tournament 2', status: 'pending', match_ids: [], rounds_to_win: 1 }
        ]);

        await flushPromises();
        await wrapper.find('button').trigger('click')
        expect(selectTournamentSpy).toHaveBeenCalled()
    })
})