import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, beforeEach } from 'vitest';
import RegisterView from '@/views/RegisterView.vue';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

describe('RegisterView.vue', () => {
	let mock: InstanceType<typeof MockAdapter>;;
	const pinia = createPinia();
	let wrapper: VueWrapper<any>;

	const router = createRouter({
		history: createWebHistory(),
		routes: [
			{ path: '/', component: RegisterView },
			{ path: '/home', name: 'home', component: { template: '<div>Home</div>' } },
		],
	});

	beforeEach(() => {
		mock = new MockAdapter(axios);
		setActivePinia(pinia);
		wrapper = mount(RegisterView, {
			global: {
				plugins: [pinia, router],
			},
		});
	});

	afterEach(() => {
		mock.reset();
	});

	it('should navigate to /home on successful registration', async () => {
		wrapper.vm.name = 'test-name';
		wrapper.vm.password = 'test-password';
		wrapper.vm.email = 'test-email';
		wrapper.vm.showRegisterForm = true;

		const mockResponse = { access_token: 'fake_token' };
		mock.onPost(`${import.meta.env.VITE_API_URL}/api/register`).reply(200, mockResponse);

		await wrapper.vm.registerUser();

		expect(wrapper.vm.$router.currentRoute.value.name).toBe('home');
	});

	it('should set errorMessage on failed registration', async () => {
		wrapper.vm.name = 'test-name';
		wrapper.vm.password = 'test-password';
		wrapper.vm.email = 'test-email';
		wrapper.vm.showRegisterForm = true;

		const mockErrorResponse = { detail: 'Registration failed' };
		mock.onPost(`${import.meta.env.VITE_API_URL}/api/register`).reply(400, mockErrorResponse);

		await wrapper.vm.registerUser();

		expect(wrapper.vm.errorMessage).toBe('Registration failed');
	});

	it('toggles should work correctly', () => {
		wrapper.vm.showTerms = false;
		wrapper.vm.toggleTerms();
		expect(wrapper.vm.showTerms).toBe(true);
		wrapper.vm.toggleTerms();
		expect(wrapper.vm.showTerms).toBe(false);

		wrapper.vm.showRegisterForm = false;
		wrapper.vm.toggleRegisterLogin();
		expect(wrapper.vm.showRegisterForm).toBe(true);
		expect(wrapper.vm.showPassword).toBe(false);
		wrapper.vm.toggleRegisterLogin();
		expect(wrapper.vm.showRegisterForm).toBe(false);
		expect(wrapper.vm.showPassword).toBe(false);

		wrapper.vm.showPassword = false;
		wrapper.vm.togglePasswordVisibility();
		expect(wrapper.vm.showPassword).toBe(true);
		wrapper.vm.togglePasswordVisibility();
		expect(wrapper.vm.showPassword).toBe(false);
	});
});
