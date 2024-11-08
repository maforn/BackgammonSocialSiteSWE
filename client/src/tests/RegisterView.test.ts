import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import RegisterView from '@/views/RegisterView.vue'

vi.mock('vue-router', () => ({
    useRouter: vi.fn()
}))

vi.mock('@/services/authService', () => ({
    registerOrLogin: vi.fn()
}))

describe('RegisterView.vue', () => {
    const mockRouter = {
        push: vi.fn()
    }

    it('renders the component correctly', () => {
        const wrapper = mount(RegisterView)
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.find('h3').text()).toBe('Sign in')
    })

    it('toggles between register and login forms', async () => {
        const wrapper = mount(RegisterView)
        expect(wrapper.find('h3').text()).toBe('Sign in')
        await wrapper.find('.register-login-switch').trigger('click')
        expect(wrapper.find('h3').text()).toBe('Register')
    })

    it('shows and hides terms and conditions', async () => {
        const wrapper = mount(RegisterView)
        expect(wrapper.find('.fixed').exists()).toBe(false)
        await wrapper.vm.toggleTerms()
        expect(wrapper.find('.fixed').exists()).toBe(true)
    })

    it('calls registerUser method on form submit', async () => {
        const wrapper = mount(RegisterView)
        const registerUserSpy = vi.spyOn(wrapper.vm, 'registerUser')
        await wrapper.find('form').trigger('submit.prevent')
        expect(registerUserSpy).toHaveBeenCalled()
    })
})