import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import Board from '@/components/Board.vue';
import { BoardConfiguration } from '@/models/BoardConfiguration';

describe('Empty Board component tests', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(Board, {
            props: {
                configuration: new BoardConfiguration(
                    Array(24).fill({ player1: 0, player2: 0 }),
                    { player1: 0, player2: 0 }
                )
            }
        });
    });

    it('Renders the board component correctly', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('Renders the correct number of points', () => {
        const points = wrapper.findAllComponents({ name: 'Point' });
        expect(points.length).toBe(24); // 4 rows * 6 points each
    });

    it('Renders points of only two colors', () => {
        const icons = wrapper.findAll('v-icon[name="io-triangle-sharp"]');
        const fillColors = new Set(icons.map(icon => icon.attributes('fill')));
        expect(fillColors.size).toBe(2);
    });

    it('Renders one and only one bar', () => {
        const barElement = wrapper.findAll('#bar');
        expect(barElement.length).toBe(1);
    });
});

describe('Deafult board configuration tests', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(Board, {
            props: {
                configuration: new BoardConfiguration()
            }
        });
    });

    it('Renders the correct number of pieces per player', () => {
        const pieces1 = wrapper.findAll('.piece.player-1');
        expect(pieces1.length).toBe(15); // 15 pieces in total for player 1

        const pieces2 = wrapper.findAll('.piece.player-2');
        expect(pieces2.length).toBe(15); // 15 pieces in total for player 2
    });

    it('Pieces are grouped correctly', () => {
        const points = wrapper.findAllComponents({ name: 'Point' });
        const pieces1 = points.map(point => point.findAll('.piece.player-1').length).sort((a, b) => a - b);
        const pieces2 = points.map(point => point.findAll('.piece.player-2').length).sort((a, b) => a - b);

        expect(pieces1).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 5, 5]);
        expect(pieces2).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 5, 5]);
    });

    it('Renders no large pieces', () => {
        const largePieces1 = wrapper.findAll('.large-piece.player-1');
        expect(largePieces1.length).toBe(0); // No large pieces for player 1

        const largePieces2 = wrapper.findAll('.large-piece.player-2');
        expect(largePieces2.length).toBe(0); // No large pieces for player 2
    });

    it('Renders no pieces in the bar', () => {
        const bar = wrapper.find('#bar');
        expect(bar.findAll('.bar-piece').length).toBe(0);
    });
});

describe('Custom board configuration tests', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        const configuration = new BoardConfiguration();

        // Add four large pieces to display
        configuration.points[1] = { player1: 6, player2: 0 };
        configuration.points[2] = { player1: 0, player2: 6 };
        configuration.points[3] = { player1: 4, player2: 4 };

        // Add two pieces to the bar
        configuration.bar = { player1: 1, player2: 1 };

        wrapper = mount(Board, {
            props: {
                configuration: configuration
            }
        });
    });

    it('Renders the correct number of pieces per player', () => {
        const pieces1 = wrapper.findAll('.piece.player-1');
        expect(pieces1.length).toBe(15); // 15 pieces in total for player 1

        const pieces2 = wrapper.findAll('.piece.player-2');
        expect(pieces2.length).toBe(15); // 15 pieces in total for player 2
    });

    it('Pieces are grouped correctly', () => {
        const points = wrapper.findAllComponents({ name: 'Point' });
        const pieces1 = points.map(point => point.findAll('.piece.player-1').length).sort((a, b) => a - b);
        const pieces2 = points.map(point => point.findAll('.piece.player-2').length).sort((a, b) => a - b);

        expect(pieces1).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 5, 5]);
        expect(pieces2).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 5, 5]);
    });

    it('Renders the correct number of large pieces', () => {
        const largePieces1 = wrapper.findAll('.large-piece.player-1');
        expect(largePieces1.length).toBe(2); // No large pieces for player 1

        const largePieces2 = wrapper.findAll('.large-piece.player-2');
        expect(largePieces2.length).toBe(2); // No large pieces for player 2
    });

    it('Renders the correct number of pieces in the bar', () => {
        const configuration = new BoardConfiguration();

        // Add one piece per player to the bar
        configuration.bar = { player1: 1, player2: 1 };
        wrapper = mount(Board, { props: { configuration: configuration } });

        let bar = wrapper.find('#bar');
        expect(bar.findAll('.bar-piece').length).toBe(2);
        expect(bar.findAll('.bar-piece.player-1').length).toBe(1);
        expect(bar.findAll('.bar-piece.player-2').length).toBe(1);

        // Add piece for player 1 only
        configuration.bar = { player1: 1, player2: 0 };
        wrapper = mount(Board, { props: { configuration: configuration } });
        bar = wrapper.find('#bar');
        expect(bar.findAll('.bar-piece').length).toBe(1);
        expect(bar.findAll('.bar-piece.player-1').length).toBe(1);
        expect(bar.findAll('.bar-piece.player-2').length).toBe(0);

        // Add piece for player 2 only
        configuration.bar = { player1: 0, player2: 1 };
        wrapper = mount(Board, { props: { configuration: configuration } });
        bar = wrapper.find('#bar');
        expect(bar.findAll('.bar-piece').length).toBe(1);
        expect(bar.findAll('.bar-piece.player-1').length).toBe(0);
        expect(bar.findAll('.bar-piece.player-2').length).toBe(1);
    });
});