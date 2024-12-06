import { describe, it, expect } from 'vitest';
import { Match } from '@/models/Match';
import { BoardConfiguration } from '@/models/BoardConfiguration';

describe('Testing Match model', () => {
  it('should create a Match instance with default values', () => {
    const match = new Match(
      'player1',
      'player2',
      new BoardConfiguration(),
      { roll: [], available: [] },
      1,
      new Date(),
      new Date(),
      'active',
      1,
      1,
      new Date(),
      [0, 0],
      { count: 0, last_usage: 0, proposed: false, proposer: 0 },
    );

    expect(match.player1).toBe('player1');
    expect(match.player2).toBe('player2');
    expect(match.boardConfiguration).toBeInstanceOf(BoardConfiguration);
    expect(match.dice).toEqual({ roll: [], available: [] });
    expect(match.turn).toBe(1);
    expect(match.status).toBe('active');
    expect(match.rounds_to_win).toBe(1);
    expect(match.winsP1).toBe(0);
    expect(match.winsP2).toBe(0);
    expect(match.starter).toBe(1);
    expect(match.startDice).toEqual({ roll1: 0, count1: 0, roll2: 0, count2: 0 });
    expect(match.doublingCube).toEqual({ count: 0, last_usage: 0, proposed: false, proposer: 0 });
    expect(match.ai_suggestions).toEqual([0, 0]);
  });
});
