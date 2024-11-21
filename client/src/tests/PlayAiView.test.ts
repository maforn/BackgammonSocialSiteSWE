import { mount } from '@vue/test-utils'
import { beforeAll, describe, it, expect, vi } from 'vitest'
import PlayAiView from '@/views/PlayAiView.vue'
import { sendInviteService } from '@/services/invitesService'
import router from '@/router'
import { createPinia, setActivePinia } from 'pinia';

vi.mock('@/services/invitesService')
vi.mock('@/router', () => ({
    push: vi.fn(),
    default: { push: vi.fn() }
}))

describe('PlayAiView.vue', () => {
    const pinia = createPinia();

    beforeAll(() => {
        setActivePinia(pinia);
    });
    it('renders correctly with initial data', () => {
        const wrapper = mount(PlayAiView)
        expect(wrapper.find('h1').text()).toBe('PLAY AI')
        expect((wrapper.find('#difficulty').element as HTMLInputElement).value).toBe('easy')
        expect((wrapper.find('#rounds_to_win').element as HTMLInputElement).value).toBe('1')
    })

    it('changes difficulty and rounds_to_win values', async () => {
        const wrapper = mount(PlayAiView)
        await wrapper.find('#difficulty').setValue('medium')
        await wrapper.find('#rounds_to_win').setValue('2')
        expect(wrapper.vm.difficulty).toBe('medium')
        expect(wrapper.vm.rounds_to_win).toBe('2')
    })

    it('calls goHome method and navigates to home', async () => {
        const wrapper = mount(PlayAiView)
        await wrapper.find('#home-btn').trigger('click')
        expect(router.push).toHaveBeenCalledWith({ name: 'home' })
    })
})