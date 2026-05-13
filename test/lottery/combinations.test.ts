// test/lottery/combinations.test.ts
import { describe, it, expect } from 'vitest';
import { drawOnePick, TOTAL_POOL, ASSIGNED } from '@/lib/lottery/combinations';
import type { TeamConfig, RNG } from '@/lib/lottery/types';

const tpdlTeams: TeamConfig[] = [
  { name: 'A', originalIndex: 0, combinations: 224 },
  { name: 'B', originalIndex: 1, combinations: 224 },
  { name: 'C', originalIndex: 2, combinations: 224 },
  { name: 'D', originalIndex: 3, combinations: 224 },
  { name: 'E', originalIndex: 4, combinations: 60 },
  { name: 'F', originalIndex: 5, combinations: 45 },
];

// Sanity check: 224*4 + 60 + 45 = 896 + 105 = 1001 - 1 discarded = 1000 assigned
// Total combinations assigned: 1000 ✓

const fixedRng = (sequence: number[]): RNG => {
  let i = 0;
  return () => sequence[i++ % sequence.length];
};

describe('constants', () => {
  it('TOTAL_POOL is 1001', () => {
    expect(TOTAL_POOL).toBe(1001);
  });

  it('ASSIGNED is 1000', () => {
    expect(ASSIGNED).toBe(1000);
  });
});

describe('drawOnePick', () => {
  it('returns the team whose combination range contains the rolled number', () => {
    // roll 0.0 → Math.floor(0.0 * 1001) = 0, which is in team A's range [0, 224)
    const rng = fixedRng([0.0]);
    const out = drawOnePick(tpdlTeams, new Set(), rng);
    expect(out).toBe(0);
  });

  it('skips already-picked teams (forces redraw)', () => {
    // first roll hits team A (index 0), but A is already picked → redraw
    // second roll (0.5) → Math.floor(0.5 * 1001) = 500
    // team A: [0, 224), B: [224, 448), C: [448, 672) → 500 is in team C (index 2)
    const rng = fixedRng([0.0, 0.5]);
    const out = drawOnePick(tpdlTeams, new Set([0]), rng);
    expect(out).not.toBe(0);
    expect(out).toBe(2); // 500 falls in team C's range
  });

  it('treats the 1001st combination as a discard (triggers redraw)', () => {
    // first roll: 1000/1001 → Math.floor(1000/1001 * 1001) = Math.floor(1000.0) = 1000
    // 1000 >= ASSIGNED (1000) → discarded, redraw
    // second roll: 0.0 → team A (index 0)
    const rng = fixedRng([1000 / 1001, 0.0]);
    const out = drawOnePick(tpdlTeams, new Set(), rng);
    expect(out).toBe(0);
  });

  it('picks the last assigned team correctly (boundary check)', () => {
    // roll 999/1001 → Math.floor(999/1001 * 1001) = Math.floor(999.000...) = 999
    // Cursor: A→224, B→448, C→672, D→896, E→956, F→1001
    // 999 < 1001 (F's cursor) and 999 >= 956 (E's cursor) → team F (index 5)
    const rng = fixedRng([999 / 1001]);
    const out = drawOnePick(tpdlTeams, new Set(), rng);
    expect(out).toBe(5);
  });

  it('picks the boundary between team A and B correctly', () => {
    // roll 224/1001 → Math.floor(224/1001 * 1001) = Math.floor(224.0) = 224
    // Cursor: A→224 (224 is NOT < 224, skip), B→448 (224 < 448) → team B (index 1)
    const rng = fixedRng([224 / 1001]);
    const out = drawOnePick(tpdlTeams, new Set(), rng);
    expect(out).toBe(1);
  });

  it('eventually terminates even if many redraws needed', () => {
    // all teams picked except team F (index 5)
    // keep forcing redraws until team F is hit
    const allExceptF = new Set([0, 1, 2, 3, 4]);
    // roll that hits F: 956/1001 → Math.floor(956.0) = 956, in [956, 1001)
    const rng = fixedRng([0.0, 0.0, 0.0, 956 / 1001]);
    const out = drawOnePick(tpdlTeams, allExceptF, rng);
    expect(out).toBe(5);
  });
});
