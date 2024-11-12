import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory, useRouter } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import axiosInstance from '@/axios';
import { nextTick } from 'vue';
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { createPinia, setActivePinia } from 'pinia';

describe('HomeView.vue', () => {
	let mock: MockAdapter;
	const pinia = createPinia();
	const router = useRouter();

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
		expect(wrapper.find('router-link').text()).toContain('NEW MATCH');
	});

	it('renders no invites message when invites list is empty', async () => {
		const wrapper = mount(HomeView);
		wrapper.vm.showOverlay = true;
		wrapper.vm.invites = [];
		await nextTick();
		expect(wrapper.find('.overlay-content p').text()).toBe('No invites.');
	});

	it('renders invites list when invites are present', async () => {
		const wrapper = mount(HomeView);
		wrapper.vm.showOverlay = true;
		wrapper.vm.invites = [{ _id: '1', player1: 'player1' }];
		await nextTick();
		expect(wrapper.findAll('.overlay-content ul li').length).toBe(1);
	});
});
