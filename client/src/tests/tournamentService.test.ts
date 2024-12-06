import { beforeEach, describe, expect, it, vi } from 'vitest';
import axiosInstance from '@/axios';
import MockAdapter from 'axios-mock-adapter';
import { createPinia, setActivePinia } from 'pinia';
import { checkCreatedTournamentExists, createTournament, fetchActiveTournament, fetchConcludedTournaments } from '@/services/tournamentService'; // Adjust import path
import { Tournament } from '@/models/Tournament';

vi.mock('@/stores/wsStore', () => ({
    useWsStore: vi.fn(() => ({
        addError: vi.fn(),
    })),
}));

describe('checkCreatedTournamentExists', () => {
    let mock: InstanceType<typeof MockAdapter>;

    beforeEach(() => {
        setActivePinia(createPinia());
        mock = new MockAdapter(axiosInstance);
    });

    it('should return tournament exists data', async () => {
        const mockResponse = true;
        mock.onGet('tournaments/exists').reply(200, mockResponse);
        const result = await checkCreatedTournamentExists();
        expect(result).toEqual(true);
    });
});

describe('createTournament', () => {
    let mock: InstanceType<typeof MockAdapter>;

    beforeEach(() => {
        setActivePinia(createPinia());
        mock = new MockAdapter(axiosInstance);
    });

    it('should return a Tournament', async () => {
        const mockResponse = {
            tournament: new Tournament(
                'testUser',
                ['testuser'],
                true,
                'testTournament',
                'round_robin',
                'pending',
                [],
                2
            )
        }

        mock.onPost('/tournaments').reply(200, mockResponse);
        const result = await createTournament('testUser', true, [], 2, 'round_robin');
        expect(result).toEqual(mockResponse.tournament);
    });

    it('should handle error', async () => {
        mock.onPost('/tournaments').reply(500, { detail: 'Error creating tournament' });
        const result = await createTournament('testUser', true, [], 2, 'round_robin');
        expect(result).toBeNull();
    });
    
});

describe('fetchActiveTournament', () => {
    let mock: InstanceType<typeof MockAdapter>;

    beforeEach(() => {
        setActivePinia(createPinia());
        mock = new MockAdapter(axiosInstance);
    });

    it('should return a Tournament', async () => {
        const mockResponse =
            new Tournament(
                'testUser',
                ['testuser'],
                true,
                'testTournament',
                'round_robin',
                'pending',
                [],
                2
            );

        mock.onGet('/tournaments').reply(200, mockResponse);
        const result = await fetchActiveTournament();
        expect(result).toEqual(mockResponse);
    });

    it('should handle error', async () => {
        mock.onGet('/tournaments').reply(500, { detail: 'Error fetching tournament' });
        const result = await fetchActiveTournament();
        expect(result).toBeNull();
    });
});

describe('fetchConcludedTournaments', () => {
    let mock: InstanceType<typeof MockAdapter>;

    beforeEach(() => {
        setActivePinia(createPinia());
        mock = new MockAdapter(axiosInstance);
    });

    it('should return concluded tournaments', async () => {
        const mockResponse = [
            new Tournament(
                'testUser1',
                ['testuser1'],
                true,
                'testTournament1',
                'round_robin',
                'concluded',
                [],
                2
            ),
            new Tournament(
                'testUser2',
                ['testuser2'],
                true,
                'testTournament2',
                'round_robin',
                'concluded',
                [],
                2
            )
        ];

        mock.onGet('/tournaments/concluded').reply(200, mockResponse);
        const result = await fetchConcludedTournaments();
        expect(result).toEqual(mockResponse);
    });

    it('should handle error', async () => {
        mock.onGet('/tournaments/concluded').reply(500, { detail: 'Error fetching concluded tournaments' });
        const result = await fetchConcludedTournaments();
        expect(result).toEqual([]);
    });
});