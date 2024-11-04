import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import DieFace from '@/components/DieFace.vue'

describe('DieFace.vue', () => {
    it('renders the correct number of dots for value 1', () => {
        const wrapper = mount(DieFace, {
            props: { value: 1 }
        })
        const dots = wrapper.findAll('.dot')
        expect(dots.length).toBe(1)
        expect(dots[0].classes()).toContain('center')
    })

    it('renders the correct number of dots for value 2', () => {
        const wrapper = mount(DieFace, {
            props: { value: 2 }
        })
        const dots = wrapper.findAll('.dot')
        expect(dots.length).toBe(2)
        expect(dots[0].classes()).toContain('top-left')
        expect(dots[1].classes()).toContain('bottom-right')
    })

    it('renders the correct number of dots for value 3', () => {
        const wrapper = mount(DieFace, {
            props: { value: 3 }
        })
        const dots = wrapper.findAll('.dot')
        expect(dots.length).toBe(3)
        expect(dots[0].classes()).toContain('top-left')
        expect(dots[1].classes()).toContain('center')
        expect(dots[2].classes()).toContain('bottom-right')
    })

    it('renders the correct number of dots for value 4', () => {
        const wrapper = mount(DieFace, {
            props: { value: 4 }
        })
        const dots = wrapper.findAll('.dot')
        expect(dots.length).toBe(4)
        expect(dots[0].classes()).toContain('top-left')
        expect(dots[1].classes()).toContain('top-right')
        expect(dots[2].classes()).toContain('bottom-left')
        expect(dots[3].classes()).toContain('bottom-right')
    })

    it('renders the correct number of dots for value 5', () => {
        const wrapper = mount(DieFace, {
            props: { value: 5 }
        })
        const dots = wrapper.findAll('.dot')
        expect(dots.length).toBe(5)
        expect(dots[0].classes()).toContain('top-left')
        expect(dots[1].classes()).toContain('top-right')
        expect(dots[2].classes()).toContain('center')
        expect(dots[3].classes()).toContain('bottom-left')
        expect(dots[4].classes()).toContain('bottom-right')
    })

    it('renders the correct number of dots for value 6', () => {
        const wrapper = mount(DieFace, {
            props: { value: 6 }
        })
        const dots = wrapper.findAll('.dot')
        expect(dots.length).toBe(6)
        expect(dots[0].classes()).toContain('top-left')
        expect(dots[1].classes()).toContain('top-right')
        expect(dots[2].classes()).toContain('middle-left')
        expect(dots[3].classes()).toContain('middle-right')
        expect(dots[4].classes()).toContain('bottom-left')
        expect(dots[5].classes()).toContain('bottom-right')
    })
})