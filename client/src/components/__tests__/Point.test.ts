import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Point from '@/components/Point.vue';

describe('Point component test', () => {
    it('Renders player1 and player2 pieces correctly', () => {
        const wrapper = mount(Point, {
            props: {
                configuration: { player1: 3, player2: 2 },
                upperPoint: false,
                index: 1
            }
        });

        expect(wrapper.findAll('.piece.player-1').length).toBe(3);
        expect(wrapper.findAll('.piece.player-2').length).toBe(2);
    });

    it('Renders large pieces when needed', () => {
        const wrapper = mount(Point, {
            props: {
                configuration: { player1: 4, player2: 3 },
                upperPoint: true,
                index: 2
            }
        });

        expect(wrapper.findAll('.large-piece.player-1').length).toBe(1);
        expect(wrapper.findAll('.large-piece.player-2').length).toBe(1);
        expect(wrapper.find('.large-piece.player-1').text()).toBe('4');
        expect(wrapper.find('.large-piece.player-2').text()).toBe('3');
    });

    it('Renders no pieces when configuration is empty', () => {
        const wrapper = mount(Point, {
            props: {
                configuration: { player1: 0, player2: 0 },
                upperPoint: false,
                index: 1
            }
        });

        expect(wrapper.findAll('.piece').length).toBe(0);
    });

    it('Applies rotate-180 class when upperPoint is true', () => {
        const wrapper = mount(Point, {
            props: {
                configuration: { player1: 6, player2: 1 },
                upperPoint: true,
                index: 1
            }
        });

        const largePieces = wrapper.findAll('.large-piece');
            largePieces.forEach(piece => {
                console.log(piece.classes());
            });

        expect(wrapper.find('.rotate-180.player-1.large-piece').exists()).toBe(true);
        expect(wrapper.find('.rotate-180.player-2.large-piece').exists()).toBe(true);
    });

    it('Does not apply rotate-180 class when upperPoint is false', () => {
        const wrapper = mount(Point, {
            props: {
                configuration: { player1: 6, player2: 1 },
                upperPoint: false,
                index: 1
            }
        });

        const largePieces = wrapper.findAll('.large-piece');
            largePieces.forEach(piece => {
                console.log(piece.classes());
            });

        expect(wrapper.find('.rotate-180.player-1.large-piece').exists()).toBe(false);
        expect(wrapper.find('.rotate-180.player-2.large-piece').exists()).toBe(false);
    });

    it('Applies consistent fill color based on index', () => {
        const evenColors = new Set();
        const oddColors = new Set();
    
        for (let i = 0; i < 10; i++) {
            const wrapper = mount(Point, {
                props: {
                    configuration: { player1: 1, player2: 1 },
                    upperPoint: false,
                    index: i
                }
            });
    
            const fillColor = wrapper.find('v-icon').attributes('fill');
            if (i % 2 === 0) {
                evenColors.add(fillColor);
            } else {
                oddColors.add(fillColor);
            }
        }
    
        expect(evenColors.size).toBe(1);
        expect(oddColors.size).toBe(1);
        expect([...evenColors][0]).not.toBe([...oddColors][0]);
    });
});