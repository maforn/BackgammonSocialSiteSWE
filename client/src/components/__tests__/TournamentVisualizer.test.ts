import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import TournamentVisualizer from '@/components/TournamentVisualizer.vue';
import { Tournament } from '@/models/Tournament';

describe('TournamentVisualizer.vue', () => {

    it('computes sortedStats correctly', async () => {
        const stats = [
            { username: 'user1', wins: 2, losses: 1, matches: 3, points: 5 },
            { username: 'user2', wins: 2, losses: 1, matches: 3, points: 6 },
            { username: 'user3', wins: 3, losses: 0, matches: 3, points: 9 },
        ];

        const tournament = new Tournament('owner', ['user1', 'user2', 'user3'], true, 'testTournament', 'round_robin', 'started', [], 2 );
        tournament.stats = stats;

        const wrapper = mount(TournamentVisualizer, {
            props: {
                tournament
            }
        });
        await wrapper.vm.$nextTick();

        const sortedStats = wrapper.vm.sortedStats;
        expect(sortedStats).toEqual([
            { username: 'user3', wins: 3, losses: 0, matches: 3, points: 9 },
            { username: 'user2', wins: 2, losses: 1, matches: 3, points: 6 },
            { username: 'user1', wins: 2, losses: 1, matches: 3, points: 5 },
        ]);
    });
});

