import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import TournamentVisualizer from '@/components/TournamentVisualizer.vue';
import { fetchActiveTournament } from '@/services/tournamentService';

vi.mock('@/services/tournamentService', () => ({
    fetchActiveTournament: vi.fn(),
}));

describe('TournamentVisualizer.vue', () => {
    it('calls fetchActiveTournament on mounted', async () => {
        (fetchActiveTournament as Mock).mockResolvedValue({
            name: 'Test Tournament',
            status: 'started',
            type: 'round_robin',
            stats: [],
        });

        mount(TournamentVisualizer);
        expect(fetchActiveTournament).toHaveBeenCalled();
    });

    it('computes sortedStats correctly', async () => {
        const stats = [
            { username: 'user1', wins: 2, losses: 1, matches: 3, points: 5 },
            { username: 'user2', wins: 2, losses: 1, matches: 3, points: 6 },
            { username: 'user3', wins: 3, losses: 0, matches: 3, points: 9 },
        ];

        (fetchActiveTournament as Mock).mockResolvedValue({
            name: 'Test Tournament',
            status: 'started',
            type: 'round_robin',
            stats,
        });

        const wrapper = mount(TournamentVisualizer);
        await wrapper.vm.$nextTick();

        const sortedStats = wrapper.vm.sortedStats;
        expect(sortedStats).toEqual([
            { username: 'user3', wins: 3, losses: 0, matches: 3, points: 9 },
            { username: 'user2', wins: 2, losses: 1, matches: 3, points: 6 },
            { username: 'user1', wins: 2, losses: 1, matches: 3, points: 5 },
        ]);
    });
});

