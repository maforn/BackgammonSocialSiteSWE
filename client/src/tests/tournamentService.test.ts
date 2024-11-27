import { beforeEach, describe, expect, it } from 'vitest';
import axiosInstance from '@/axios';
import MockAdapter from 'axios-mock-adapter';
import { createPinia, setActivePinia } from 'pinia';
import { checkCreatedTournamentExists, createTournament, fetchActiveTournament } from '@/services/tournamentService'; // Adjust import path
import { Tournament } from '@/models/Tournament';


describe('checkCreatedTournamentExists', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        setActivePinia(createPinia());
        mock = new MockAdapter(axiosInstance);
    });

    it('should return tournament exists data', async () => {
        // Prepare mock response
        const mockResponse = true;

        // Mock axios get method
        mock.onGet('tournaments/exists').reply(200, mockResponse);

        // Call the function
        const result = await checkCreatedTournamentExists();

        // Assertions
        expect(result).toEqual(true);
    });
});

describe('createTournament', () => {
    let mock: MockAdapter;

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
                'pending',
                [],
                2
            )
        }

        mock.onPost('/tournaments').reply(200, mockResponse);
        const result = await createTournament('testUser', true, [], 2);
        expect(result).toEqual(mockResponse.tournament);
    });
    
});

describe('fetchActiveTournament', () => {
    let mock: MockAdapter;

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
                'pending',
                [],
                2
            );

        mock.onGet('/tournaments').reply(200, mockResponse);
        const result = await fetchActiveTournament();
        expect(result).toEqual(mockResponse);
    });
});