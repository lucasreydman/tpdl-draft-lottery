// test/lottery/parity.test.ts
import { describe, it, expect } from 'vitest';
import { runDraw } from '@/lib/lottery/draw';
import { TPDL_ODDS } from '@/lib/lottery/odds';
import type { TeamConfig } from '@/lib/lottery/types';

const TPDL_TEAMS: TeamConfig[] = Array.from({ length: 10 }, (_, i) => ({
  name: `Team${i}`,
  originalIndex: i,
  combinations: [224, 224, 224, 224, 60, 45, 0, 0, 0, 0][i],
}));

const TOLERANCE = 0.007;
const N = 100_000;

describe('lottery parity vs verified odds', () => {
  it(`${N} runs match TPDL_ODDS within ${TOLERANCE} absolute`, () => {
    const counts = Array.from({ length: 6 }, () => new Array<number>(6).fill(0));
    for (let n = 0; n < N; n++) {
      const { drawSequence } = runDraw({ teams: TPDL_TEAMS }, Math.random);
      for (const e of drawSequence) {
        if (e.pick > 6) continue;
        if (e.teamIndex < 6) counts[e.teamIndex][e.pick - 1]++;
      }
    }

    // Structural zero invariants: not statistical.
    // 10th seed can't get pick 6 (by-record fills picks 5-6 with worst remaining).
    // 5th seed can't get pick 5 (same mechanic).
    expect(counts[0][5], '10th seed must never receive pick 6').toBe(0);
    expect(counts[5][4], '5th seed must never receive pick 5').toBe(0);

    // Statistical parity for all 36 cells.
    const failures: { team: number; pick: number; empirical: number; expected: number; delta: number }[] = [];
    for (let team = 0; team < 6; team++) {
      for (let pick = 0; pick < 6; pick++) {
        const empirical = counts[team][pick] / N;
        const expected = TPDL_ODDS[team][pick];
        const delta = Math.abs(empirical - expected);
        if (delta >= TOLERANCE) {
          failures.push({ team, pick, empirical, expected, delta });
        }
      }
    }
    expect(failures, `cells exceeding ${TOLERANCE} tolerance:\n${JSON.stringify(failures, null, 2)}`).toEqual([]);
  }, 30_000);
});
