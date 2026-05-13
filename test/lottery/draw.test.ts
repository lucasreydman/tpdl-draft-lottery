// test/lottery/draw.test.ts
import { describe, it, expect } from 'vitest';
import { runDraw } from '@/lib/lottery/draw';
import type { TeamConfig } from '@/lib/lottery/types';

const TPDL_TEAMS: TeamConfig[] = Array.from({ length: 10 }, (_, i) => ({
  name: `Team${i}`,
  originalIndex: i,
  combinations: [224, 224, 224, 224, 60, 45, 0, 0, 0, 0][i],
}));

describe('runDraw', () => {
  it('returns 10 events covering picks 1-10 exactly once', () => {
    const { drawSequence, finalOrder } = runDraw({ teams: TPDL_TEAMS }, Math.random);
    const picks = drawSequence.map(e => e.pick).sort((a, b) => a - b);
    expect(picks).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(new Set(finalOrder).size).toBe(10);
    expect(finalOrder).toHaveLength(10);
  });

  it('uses lottery kind for picks 1-4, byRecord for 5-6, locked for 7-10', () => {
    const { drawSequence } = runDraw({ teams: TPDL_TEAMS }, Math.random);
    const sorted = [...drawSequence].sort((a, b) => a.pick - b.pick);
    expect(sorted[0].kind).toBe('lottery');
    expect(sorted[3].kind).toBe('lottery');
    expect(sorted[4].kind).toBe('byRecord');
    expect(sorted[5].kind).toBe('byRecord');
    expect(sorted[6].kind).toBe('locked');
    expect(sorted[9].kind).toBe('locked');
  });

  it('by-record picks (5-6) go to the worst-seeded non-lottery teams ascending', () => {
    const { drawSequence } = runDraw({ teams: TPDL_TEAMS }, Math.random);
    const lotteryIndexes = new Set(
      drawSequence.filter(e => e.kind === 'lottery').map(e => e.teamIndex),
    );
    const byRecord = drawSequence.filter(e => e.kind === 'byRecord');
    const remainingSorted = TPDL_TEAMS
      .map(t => t.originalIndex)
      .filter(i => !lotteryIndexes.has(i))
      .sort((a, b) => a - b)
      .slice(0, 2);
    expect(byRecord.sort((a, b) => a.pick - b.pick).map(e => e.teamIndex))
      .toEqual(remainingSorted);
  });

  it('locked picks (7-10) go to teams with zero combinations in standings order', () => {
    const { drawSequence } = runDraw({ teams: TPDL_TEAMS }, Math.random);
    const locked = drawSequence.filter(e => e.kind === 'locked').sort((a, b) => a.pick - b.pick);
    expect(locked.map(e => e.teamIndex)).toEqual([6, 7, 8, 9]);
  });

  it('throws when combinations do not sum to TOTAL_POOL (1001)', () => {
    const badTeams: TeamConfig[] = Array.from({ length: 10 }, (_, i) => ({
      name: `Team${i}`,
      originalIndex: i,
      combinations: [224, 224, 224, 224, 60, 44, 0, 0, 0, 0][i], // sum = 1000, not 1001
    }));
    expect(() => runDraw({ teams: badTeams }, Math.random)).toThrow('1001');
  });

  it('throws when fewer than 4 lottery-eligible teams', () => {
    // 3 lottery-eligible teams summing to TOTAL_POOL (1001), but only 3 eligible
    const badTeams: TeamConfig[] = Array.from({ length: 5 }, (_, i) => ({
      name: `Team${i}`,
      originalIndex: i,
      combinations: [400, 400, 201, 0, 0][i], // sum = 1001 ✓, but only 3 eligible
    }));
    expect(() => runDraw({ teams: badTeams }, Math.random)).toThrow('lottery-eligible');
  });
});
