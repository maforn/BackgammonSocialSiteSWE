export class PointConfiguration {
    player1: number;
    player2: number;

    constructor(player1: number, player2: number) {
        this.player1 = player1;
        this.player2 = player2;
    }
}

// Starting configuration for the board
const DEFAULT_POINTS: PointConfiguration[] = [
    new PointConfiguration(0, 2), // Point 1
    new PointConfiguration(0, 0), // Point 2
    new PointConfiguration(0, 0), // Point 3
    new PointConfiguration(0, 0), // Point 4
    new PointConfiguration(0, 0), // Point 5
    new PointConfiguration(5, 0), // Point 6
    new PointConfiguration(0, 0), // Point 7
    new PointConfiguration(3, 0), // Point 8
    new PointConfiguration(0, 0), // Point 9
    new PointConfiguration(0, 0), // Point 10
    new PointConfiguration(0, 0), // Point 11
    new PointConfiguration(0, 5), // Point 12
    new PointConfiguration(5, 0), // Point 13
    new PointConfiguration(0, 0), // Point 14
    new PointConfiguration(0, 0), // Point 15
    new PointConfiguration(0, 0), // Point 16
    new PointConfiguration(0, 3), // Point 17
    new PointConfiguration(0, 0), // Point 18
    new PointConfiguration(0, 5), // Point 19
    new PointConfiguration(0, 0), // Point 20
    new PointConfiguration(0, 0), // Point 21
    new PointConfiguration(0, 0), // Point 22
    new PointConfiguration(0, 0), // Point 23
    new PointConfiguration(2, 0)  // Point 24
];

export class BoardConfiguration {
    points: PointConfiguration[];
    bar: PointConfiguration;

    constructor(points?: PointConfiguration[], bar?: PointConfiguration) {
        this.points = points ?? DEFAULT_POINTS;
        this.bar = bar ?? new PointConfiguration(0, 0);
    }
}