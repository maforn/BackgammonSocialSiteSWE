import { mount } from '@vue/test-utils';
import HomeView from '@/views/HomeView.vue';
import axiosInstance from '@/axios';
import { nextTick } from 'vue';
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { createPinia, setActivePinia } from 'pinia';

describe('HomeView.vue', () => {
	let mock: InstanceType<typeof MockAdapter>;;
	const pinia = createPinia();

	beforeAll(() => {
		setActivePinia(pinia);
	});

	beforeEach(async () => {
		mock = new MockAdapter(axiosInstance);
		mock.onGet('/users/me').reply(200, { data: { username: 'testuser' } });
	});

	afterEach(() => {
		mock.reset();
	});

	it('renders correctly', () => {
		const wrapper = mount(HomeView);
		expect(wrapper.exists()).toBe(true);
		expect(wrapper.find('h1').text()).toBe('SOCIAL BACKGAMMON');
	});

	it('shows invites overlay when button is clicked', async () => {
		const wrapper = mount(HomeView);
		await nextTick();
		await wrapper.find('#show-invites-btn').trigger('click');
		await nextTick();
		expect(wrapper.vm.showOverlay).toBe(true);
	});

	it('calls logout method when logout is clicked', async () => {
		const wrapper = mount(HomeView);
		const logoutSpy = vi.spyOn(wrapper.vm, 'logout');
		await wrapper.find('#logout').trigger('click');
		expect(logoutSpy).toHaveBeenCalled();
	});

	it('renders resume match button when hasSuspendedGame is true', async () => {
		const wrapper = mount(HomeView);
		wrapper.vm.hasSuspendedGame = true;
		await nextTick();
		expect(wrapper.find('router-link').text()).toContain('RESUME MATCH');
	});

	it('renders new match button when hasSuspendedGame is false', async () => {
		const wrapper = mount(HomeView);
		wrapper.vm.hasSuspendedGame = false;
		await nextTick();
		expect(wrapper.find('router-link').text()).toContain('PLAY HUMAN');
	});

    it('renders play human button when hasSuspendedGame is false', async () => {
        const wrapper = mount(HomeView)
        wrapper.vm.hasSuspendedGame = false
        await nextTick()
        expect(wrapper.find('router-link').text()).toContain('PLAY HUMAN')
    })

    it('renders play AI button when hasSuspendedGame is false', async () => {
        const wrapper = mount(HomeView)
        wrapper.vm.hasSuspendedGame = false
        await nextTick()
        expect(wrapper.find('router-link:nth-child(2)').text()).toContain('PLAY AI')
    })

    it('does not render play AI button when hasSuspendedGame is true', async () => {
        const wrapper = mount(HomeView)
        wrapper.vm.hasSuspendedGame = true
        await nextTick()
        expect(wrapper.find('router-link:nth-child(2)').text()).not.toContain('PLAY AI')
    })

	it('renders invites list when invites are present', async () => {
		const wrapper = mount(HomeView);
		wrapper.vm.showOverlay = true;
		wrapper.vm.invites = [{ _id: '1', player1: 'player1', rounds_to_win: 1 }];
		await nextTick();
		expect(wrapper.findAll('.overlay-content ul li').length).toBe(1);
	});

	it('calls the correct endpoint when acceptInvite is called', async () => {
		const wrapper = mount(HomeView, {
		  pinia
		})
	  
		const invites = [
		  { _id: 'invite1', player1: 'player1', rounds_to_win: 3 },
		  { _id: 'invite2', player1: 'player2', rounds_to_win: 5 }
		]
		wrapper.vm.invites = invites
	  
		const postSpy = vi.spyOn(axiosInstance, 'post')
		mock.onPost('/invites/accept').reply(200)
	  
		await wrapper.vm.acceptInvite(0)
		expect(postSpy).toHaveBeenCalledWith('/invites/accept', { invite_id: 'invite1' })
	  })

	it('closes overlay', async () => {
		const wrapper = mount(HomeView);
		wrapper.vm.showOverlay = true;
		await nextTick();
		wrapper.vm.closeOverlay();
		await nextTick();
		expect(wrapper.vm.showOverlay).toBe(false);
	})
});
