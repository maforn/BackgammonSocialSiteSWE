import { mount } from '@vue/test-utils'
import TournamentView from '@/views/TournamentView.vue'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import router from '@/router'
import { Tournament } from '@/models/Tournament'
import { createPinia, setActivePinia } from 'pinia';

describe('TournamentView.vue', () => {
    const pinia = createPinia();
    let tournament: Tournament;

	beforeAll(() => {
        tournament = new Tournament('owner', ['p1', 'p2'], true, 'tournament', 'round_robin', 'pending', [], 2);
		setActivePinia(pinia);
        vi.clearAllMocks();
	});

	it('should navigate to home on goHome method call', async () => {
		const wrapper = mount(TournamentView, {
			global: {
				plugins: [router]
			}
		})
		const goHomeSpy = vi.spyOn(wrapper.vm, 'goHome')
		await wrapper.vm.goHome()
		expect(goHomeSpy).toHaveBeenCalled()
	})

	it('should update tournament on updateTournament method call', async () => {
		const wrapper = mount(TournamentView)
		await wrapper.vm.updateTournament(tournament)
		expect(wrapper.vm.hasCreatedTournament).toBe(true)
		expect(wrapper.vm.activeTournament).toEqual(tournament)
	})

	it('should show create panel on showCreatePanel method call', async () => {
		const wrapper = mount(TournamentView)
		await wrapper.vm.showCreatePanel()
		expect(wrapper.vm.showCreate).toBe(true)
		expect(wrapper.vm.showJoin).toBe(false)
		expect(wrapper.vm.showConcluded).toBe(false)
	})

	it('should show join panel on showJoinPanel method call', async () => {
		const wrapper = mount(TournamentView)
		await wrapper.vm.showJoinPanel()
		expect(wrapper.vm.showCreate).toBe(false)
		expect(wrapper.vm.showJoin).toBe(true)
		expect(wrapper.vm.showConcluded).toBe(false)
	})

	it('should show active panel on showActivePanel method call', async () => {
		const wrapper = mount(TournamentView)
		await wrapper.vm.showActivePanel()
		expect(wrapper.vm.showActive).toBe(true)
		expect(wrapper.vm.showConcluded).toBe(false)
	})

	it('should show concluded panel on showConcludedPanel method call', async () => {
		const wrapper = mount(TournamentView)
		await wrapper.vm.showConcludedPanel()
		expect(wrapper.vm.showCreate).toBe(false)
		expect(wrapper.vm.showJoin).toBe(false)
		expect(wrapper.vm.showActive).toBe(false)
		expect(wrapper.vm.showConcluded).toBe(true)
	})

	it('should show tournament result panel on showTournamentResultPanel method call', async () => {
		const wrapper = mount(TournamentView)
		await wrapper.vm.showTournamentResultPanel(tournament)
		expect(wrapper.vm.selectedTournament).toEqual(tournament)
		expect(wrapper.vm.showTournamentResult).toBe(true)
	})

	it('should hide tournament result panel on hideTournamentResultPanel method call', async () => {
		const wrapper = mount(TournamentView)
		await wrapper.vm.hideTournamentResultPanel()
		expect(wrapper.vm.showTournamentResult).toBe(false)
	})
})