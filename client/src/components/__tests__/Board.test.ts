import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi, beforeAll, afterEach } from 'vitest';
import GameBoard from '@/components/GameBoard.vue';
import { BoardConfiguration, PointConfiguration } from '@/models/BoardConfiguration';
import MockAdapter from 'axios-mock-adapter';
import { createPinia, setActivePinia } from 'pinia';
import axiosInstance from '@/axios';

let mock: MockAdapter;
const pinia = createPinia();

beforeAll(() => {
	mock = new MockAdapter(axiosInstance);
	setActivePinia(pinia);
});

afterEach(() => {
	mock.reset();
});

describe('Empty Board component tests', () => {
	let wrapper: VueWrapper<any>;

	beforeEach(() => {
		wrapper = mount(GameBoard, {
			props: {
				configuration: new BoardConfiguration(Array(24).fill({ player1: 0, player2: 0 }), { player1: 0, player2: 0 }),
				dice: [],
				yourTurn: false,
			},
		});
	});

	it('Renders the board component correctly', () => {
		expect(wrapper.exists()).toBe(true);
	});

	it('Renders the correct number of points', () => {
		const points = wrapper.findAllComponents({ name: 'PointComponent' });
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

describe('Default board configuration tests', () => {
	let wrapper: VueWrapper<any>;

	beforeEach(() => {
		wrapper = mount(GameBoard, {
			props: {
				configuration: new BoardConfiguration(),
				dice: [],
				yourTurn: false,
			},
		});
	});

	it('Renders the correct number of pieces per player', () => {
		const pieces1 = wrapper.findAll('.piece.player-1');
		expect(pieces1.length).toBe(15); // 15 pieces in total for player 1

		const pieces2 = wrapper.findAll('.piece.player-2');
		expect(pieces2.length).toBe(15); // 15 pieces in total for player 2
	});

	it('Pieces are grouped correctly', () => {
		const points = wrapper.findAllComponents({ name: 'PointComponent' });
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
		configuration.bar = new PointConfiguration(1, 1);

		wrapper = mount(GameBoard, {
			props: {
				configuration: configuration,
				dice: [],
				yourTurn: false,
			},
		});
	});

	it('Renders the correct number of pieces per player', () => {
		const pieces1 = wrapper.findAll('.piece.player-1');
		expect(pieces1.length).toBe(15); // 15 pieces in total for player 1

		const pieces2 = wrapper.findAll('.piece.player-2');
		expect(pieces2.length).toBe(15); // 15 pieces in total for player 2
	});

	it('Pieces are grouped correctly', () => {
		const points = wrapper.findAllComponents({ name: 'PointComponent' });
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
		wrapper = mount(GameBoard, {
			props: {
				configuration: configuration,
				dice: [],
				yourTurn: false,
			},
		});
		let bar = wrapper.find('#bar');
		expect(bar.findAll('.bar-piece').length).toBe(2);
		expect(bar.findAll('.bar-piece.player-1').length).toBe(1);
		expect(bar.findAll('.bar-piece.player-2').length).toBe(1);

		// Add piece for player 1 only
		configuration.bar = { player1: 1, player2: 0 };
		wrapper = mount(GameBoard, {
			props: {
				configuration: configuration,
				dice: [],
				yourTurn: false,
			},
		});
		bar = wrapper.find('#bar');
		expect(bar.findAll('.bar-piece').length).toBe(1);
		expect(bar.findAll('.bar-piece.player-1').length).toBe(1);
		expect(bar.findAll('.bar-piece.player-2').length).toBe(0);

		// Add piece for player 2 only
		configuration.bar = { player1: 0, player2: 1 };
		wrapper = mount(GameBoard, {
			props: {
				configuration: configuration,
				dice: [],
				yourTurn: false,
			},
		});
		bar = wrapper.find('#bar');
		expect(bar.findAll('.bar-piece').length).toBe(1);
		expect(bar.findAll('.bar-piece.player-1').length).toBe(0);
		expect(bar.findAll('.bar-piece.player-2').length).toBe(1);
	});
});

describe('Board component point selection tests', () => {
	let wrapper: VueWrapper<any>;

	beforeEach(() => {
		wrapper = mount(GameBoard, {
			props: {
				configuration: new BoardConfiguration(),
				dice: [1],
				yourTurn: true,
			},
		});
	});

	it('Points call selectPoint method when clicked', async () => {
		wrapper = mount(GameBoard, {
			props: {
				configuration: new BoardConfiguration(
					Array(24).fill(new PointConfiguration(0, 0)),
					new PointConfiguration(0, 0),
				),
				dice: [1],
				yourTurn: true,
			},
		});

		wrapper.vm.availableDice = [1];
		wrapper.vm.internalConfig.points[0] = new PointConfiguration(1, 0);

		const selectPointSpy = vi.spyOn(wrapper.vm, 'selectPoint');

		const points = wrapper.findAllComponents({ name: 'PointComponent' });
		for (const point of points) {
			await point.trigger('click');
		}

		expect(selectPointSpy).toHaveBeenCalledTimes(1);
	});

	it('Calls movePiece with correct parameters when there are pieces in the bar', () => {
		wrapper.vm.internalConfig.bar.player1 = 1;
		wrapper.vm.availableDice = [1];

		const movePieceSpy = vi.spyOn(wrapper.vm, 'movePiece');

		wrapper.vm.selectPoint(23);

		expect(movePieceSpy).toHaveBeenCalledWith(24, 23);
	});

	it('Selects correct point when no point is selected yet', () => {
		wrapper.vm.internalConfig.bar.player1 = 0;
		wrapper.vm.srcPointIndex = null;

		wrapper.vm.selectPoint(5);

		expect(wrapper.vm.srcPointIndex).toBe(5);
	});

	it('Calls movePiece with correct parameters when a point is already selected', () => {
		wrapper.vm.internalConfig.bar.player1 = 0;
		wrapper.vm.srcPointIndex = 5;
		wrapper.vm.internalConfig.points[5].player1 = 1;
		wrapper.vm.availableDice = [2];
		wrapper.vm.internalConfig.points[3].player2 = 0;

		const movePieceSpy = vi.spyOn(wrapper.vm, 'movePiece');
		wrapper.vm.selectPoint(3);

		expect(movePieceSpy).toHaveBeenCalledWith(5, 3);
	});

	it('Sets srcPointIndex to null when deselectPoint is called', () => {
		wrapper.vm.srcPointIndex = 3;

		wrapper.vm.deselectPoint();

		expect(wrapper.vm.srcPointIndex).toBe(null);
	});
});

describe('Board component movePiece method tests', () => {
	let wrapper: VueWrapper<any>;

	beforeEach(() => {
		wrapper = mount(GameBoard, {
			props: {
				configuration: new BoardConfiguration(),
				dice: [],
				yourTurn: true,
			},
		});
	});

	it('Moves a piece from the bar to a point', () => {
		wrapper.vm.internalConfig.bar.player1 = 1;
		wrapper.vm.internalConfig.points[23] = new PointConfiguration(0, 0);

		wrapper.vm.availableDice = [1];
		wrapper.vm.movePiece(24, 23);

		expect(wrapper.vm.internalConfig.bar.player1).toBe(0);
		expect(wrapper.vm.internalConfig.points[23].player1).toBe(1);
		expect(wrapper.vm.availableDice).toEqual([]);
	});

	it('Moves a piece from one point to another', () => {
		wrapper.vm.internalConfig.points[23] = new PointConfiguration(1, 0);
		wrapper.vm.internalConfig.points[22] = new PointConfiguration(0, 0);

		wrapper.vm.srcPointIndex = 23;
		wrapper.vm.availableDice = [1, 5];

		wrapper.vm.movePiece(23, 22);

		expect(wrapper.vm.internalConfig.points[23].player1).toBe(0);
		expect(wrapper.vm.internalConfig.points[22].player1).toBe(1);
		expect(wrapper.vm.availableDice).toEqual([5]);
	});

	it("Hits an opponent's piece", () => {
		wrapper.vm.internalConfig.points[5] = new PointConfiguration(1, 0);
		wrapper.vm.internalConfig.points[3] = new PointConfiguration(0, 1);
		wrapper.vm.srcPointIndex = 5;
		wrapper.vm.availableDice = [2, 3];
		wrapper.vm.movePiece(5, 3);

		expect(wrapper.vm.internalConfig.points[3].player2).toBe(0);
		expect(wrapper.vm.internalConfig.bar.player2).toBe(1);
		expect(wrapper.vm.internalConfig.points[3].player1).toBe(1);
		expect(wrapper.vm.internalConfig.points[5].player1).toBe(0);
		expect(wrapper.vm.availableDice).toEqual([3]);
	});

	it("Updates double dice correctly", () => {
		wrapper.vm.internalConfig.points[5] = new PointConfiguration(1, 0);
		wrapper.vm.internalConfig.points[3] = new PointConfiguration(0, 1);
		wrapper.vm.srcPointIndex = 5;
		wrapper.vm.availableDice = [2, 2, 2, 2];
		wrapper.vm.movePiece(5, 3);

		expect(wrapper.vm.internalConfig.points[3].player2).toBe(0);
		expect(wrapper.vm.internalConfig.bar.player2).toBe(1);
		expect(wrapper.vm.internalConfig.points[3].player1).toBe(1);
		expect(wrapper.vm.internalConfig.points[5].player1).toBe(0);
		expect(wrapper.vm.availableDice).toEqual([2, 2, 2]);
	});

	it('Updates available dice and resets selected point', () => {
		wrapper.vm.internalConfig.points[3].player1 = 1;
		wrapper.vm.availableDice = [2];
		wrapper.vm.srcPointIndex = 3;
		wrapper.vm.movePiece(3, 1);

		expect(wrapper.vm.availableDice).toEqual([]);
		expect(wrapper.vm.srcPointIndex).toBe(null);
	});

	it('throws an error when indices are out of range', () => {
		expect(() => wrapper.vm.movePiece(25, 22)).toThrow('Indices are out of range');
		expect(() => wrapper.vm.movePiece(23, 24)).toThrow('Indices are out of range');
		expect(() => wrapper.vm.movePiece(-1, 22)).toThrow('Indices are out of range');
		expect(() => wrapper.vm.movePiece(23, -2)).toThrow('Indices are out of range');
	});

	it('throws an error when pieces should be moved out of the bar first', () => {
		wrapper.vm.internalConfig.bar.player1 = 1;
		expect(() => wrapper.vm.movePiece(23, 22)).toThrow('You should move pieces out of the bar first!');
	});

	it('throws an error when moving to higher points', () => {
		expect(() => wrapper.vm.movePiece(22, 23)).toThrow('You cannot move to higher points!');
	});

	it('throws an error when there are no pieces to move', () => {
		wrapper.vm.internalConfig.points[23].player1 = 0;
		expect(() => wrapper.vm.movePiece(23, 22)).toThrow('You have no pieces to move!');
		wrapper.vm.internalConfig.bar.player1 = 0;
		expect(() => wrapper.vm.movePiece(24, 22)).toThrow('You have no pieces to move!');
	});

	it('throws an error when the destination point is not allowed', () => {
		wrapper.vm.availableDice = [2];
		wrapper.vm.internalConfig.points[23] = new PointConfiguration(1, 0);
		wrapper.vm.internalConfig.points[22] = new PointConfiguration(0, 0);
		expect(() => wrapper.vm.movePiece(23, 22)).toThrow('The destination point is not allowed');
	});
});


describe('Board swap test', () => {
	it('swaps players correctly', () => {
		const initialBoard = new BoardConfiguration();
		const wrapper = mount(GameBoard, {
			props: {
				configuration: initialBoard,
				dice: [],
				yourTurn: true,
			},
		});

		const initialPlayer1 = initialBoard.points.map(point => point.player1);
		const initialPlayer2 = initialBoard.points.map(point => point.player2);
		const initialBar1 = initialBoard.bar.player1;
		const initialBar2 = initialBoard.bar.player2;

		const swappedBoard = wrapper.vm.swapPlayers(initialBoard);

		const swappedPlayer1 = swappedBoard.points.map(point => point.player1);
		const swappedPlayer2 = swappedBoard.points.map(point => point.player2);
		const swappedBar1 = swappedBoard.bar.player1;
		const swappedBar2 = swappedBoard.bar.player2;

		expect(initialPlayer1).toEqual(swappedPlayer2.reverse());
		expect(initialPlayer2).toEqual(swappedPlayer1.reverse());
		expect(initialBar1).toBe(swappedBar2);
		expect(initialBar2).toBe(swappedBar1);
	});
});

describe('Bearing off tests', () => {
	const wrapper = mount(GameBoard, {
		props: {
			configuration: new BoardConfiguration(),
			dice: [],
			yourTurn: true,
		},
	});

	it('bear off area should not be visible by default', () => {
		expect(wrapper.vm.showBearOff).toBe(false);
	});

	it('bear off area should be visible if pieces have already been moved to the bear off area', () => {
		wrapper.vm.internalConfig = new BoardConfiguration(
			Array(24).fill(new PointConfiguration(0, 0)),
			new PointConfiguration(0, 0),
		);
		wrapper.vm.srcPointIndex = null;

		expect(wrapper.vm.showBearOff).toBe(true);
		expect(wrapper.vm.bearOffAllowed).toBe(false);
	});

	it('bear off area should be visible when bearing off is possible', () => {
		wrapper.vm.availableDice = [1, 2, 3];
		wrapper.vm.internalConfig = new BoardConfiguration(
			Array(24).fill(new PointConfiguration(0, 0)),
			new PointConfiguration(0, 0),
		);
		wrapper.vm.internalConfig.points[0] = new PointConfiguration(5, 0);
		wrapper.vm.internalConfig.points[1] = new PointConfiguration(5, 0);
		wrapper.vm.internalConfig.points[2] = new PointConfiguration(5, 0);
		wrapper.vm.srcPointIndex = 0;

		expect(wrapper.vm.allowedPointIndices.includes(-1)).toBe(true);
		expect(wrapper.vm.bearOffAllowed).toBe(true);
		expect(wrapper.vm.showBearOff).toBe(true);
	});

	it('bear off area should contain the correct number of pieces', async () => {
		wrapper.vm.internalConfig = new BoardConfiguration(
			Array(24).fill(new PointConfiguration(0, 0)),
			new PointConfiguration(0, 0),
		);
		expect(wrapper.vm.showBearOff).toBe(true);
	});

	it('bearing off should remove a piece from the board', () => {
		wrapper.vm.availableDice = [1];
		wrapper.vm.internalConfig = new BoardConfiguration(
			Array(24).fill(new PointConfiguration(0, 0)),
			new PointConfiguration(0, 0),
		);
		wrapper.vm.internalConfig.points[0] = new PointConfiguration(5, 0);
		wrapper.vm.internalConfig.points[1] = new PointConfiguration(5, 0);
		wrapper.vm.internalConfig.points[2] = new PointConfiguration(5, 0);
		wrapper.vm.srcPointIndex = 0;

		wrapper.vm.movePiece(0, -1);
		expect(wrapper.vm.availableDice.length).toBe(0);
		expect(wrapper.vm.internalConfig.points[0].player1).toBe(4);
	});

	it('bearing off should be allowed even if the dice is higher than the highest point with pieces', () => {
		wrapper.vm.availableDice = [2];
		wrapper.vm.internalConfig = new BoardConfiguration(
			Array(24).fill(new PointConfiguration(0, 0)),
			new PointConfiguration(0, 0),
		);
		wrapper.vm.internalConfig.points[0] = new PointConfiguration(5, 0);
		wrapper.vm.internalConfig.points[1] = new PointConfiguration(5, 0);
		wrapper.vm.internalConfig.points[2] = new PointConfiguration(5, 0);
		wrapper.vm.srcPointIndex = 0;

		wrapper.vm.movePiece(0, -1);
		expect(wrapper.vm.availableDice.length).toBe(0);
		expect(wrapper.vm.internalConfig.points[0].player1).toBe(4);
	});
});
