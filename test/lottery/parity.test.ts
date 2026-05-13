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

describe('lottery parity vs verified odds', () => {
  it('100K runs match TPDL_ODDS within 0.005 absolute', () => {
    const N = 100_000;
    const counts = Array.from({ length: 6 }, () => new Array<number>(6).fill(0));
    for (let n = 0; n < N; n++) {
      const { drawSequence } = runDraw({ teams: TPDL_TEAMS }, Math.random);
      for (const e of drawSequence) {
        if (e.pick > 6) continue;
        if (e.teamIndex < 6) counts[e.teamIndex][e.pick - 1]++;
      }
    }
    for (let team = 0; team < 6; team++) {
      for (let pick = 0; pick < 6; pick++) {
        const empirical = counts[team][pick] / N;
        const expected = TPDL_ODDS[team][pick];
        expect(Math.abs(empirical - expected)).toBeLessThan(0.005);
      }
    }
  }, 30_000);
});
