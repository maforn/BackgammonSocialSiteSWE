import { mount, flushPromises } from '@vue/test-utils'
import UserStatsView from '@/views/UserStatsView.vue'
import axiosInstance from '@/axios'
import router from '@/router'
import MockAdapter from 'axios-mock-adapter';
import { createPinia, setActivePinia } from 'pinia';
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'

vi.mock('@/router', () => ({
    push: vi.fn(),
    default: { push: vi.fn() }
}));

function setup(mock) {
    mock.onGet('/users/me').reply(200, {
        _id: '1',
        username: 'testuser',
        rating: 1500,
        position: 1,
        stats: {
            matches_played: 10,
            matches_won: 5,
            tournaments_won: 2,
            highest_rating: 1600
        }
    });
}

describe('UserStatsView.vue', () => {

    let mock: MockAdapter;
    const pinia = createPinia();

    beforeAll(() => {
        mock = new MockAdapter(axiosInstance);
        setActivePinia(pinia);
    });

    afterEach(() => {
        mock.reset();
    });

    it('renders correctly', async () => {
        setup(mock)

        const wrapper = mount(UserStatsView, {
            global: {
                plugins: [pinia, router]
            }
        })


        await flushPromises();
        await wrapper.vm.$nextTick()

        expect(wrapper.find('h1').text()).toBe('YOUR STATS')
        expect(wrapper.find('h2').text()).toBe('testuser')
        expect(wrapper.findAll('div.flex-1 div')[0].text()).toContain('Matches Won')
        expect(wrapper.findAll('div.flex-1 div')[1].text()).toContain('Tournaments Won')
        expect(wrapper.findAll('div.flex-1 div')[2].text()).toContain('Matches Played')
        expect(wrapper.findAll('div.flex-1 div')[3].text()).toContain('Current Rating')
        expect(wrapper.findAll('div.flex-1 div')[4].text()).toContain('Highest Rating')
    })

    it('fetches and displays user data correctly', async () => {
        setup(mock)

        const wrapper = mount(UserStatsView, {
            global: {
                plugins: [pinia, router]
            }
        })

        await flushPromises();
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.myData.username).toBe('testuser')
        expect(wrapper.vm.myData.rating).toBe(1500)
        expect(wrapper.vm.myData.stats.matches_played).toBe(10)
        expect(wrapper.vm.myData.stats.matches_won).toBe(5)
        expect(wrapper.vm.myData.stats.tournaments_won).toBe(2)
        expect(wrapper.vm.myData.stats.highest_rating).toBe(1600)
    })
})