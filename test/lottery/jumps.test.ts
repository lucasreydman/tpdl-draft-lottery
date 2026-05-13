import { describe, it, expect } from 'vitest';
import { analyzeJumps } from '@/lib/lottery/jumps';

describe('analyzeJumps', () => {
  it('flags a 5th seed (originalIndex 4) landing in picks 1-4 as a jumper', () => {
    // finalOrder[pickIdx] = originalIndex
    const finalOrder = [4, 0, 1, 2, 3, 5, 6, 7, 8, 9];
    const analysis = analyzeJumps(finalOrder);
    expect(analysis.jumpers).toHaveLength(1);
    expect(analysis.jumpers[0]).toMatchObject({ teamIndex: 4, pick: 1, fromSeed: 5 });
    expect(analysis.hasChaos).toBe(true);
  });

  it('flags a 6th seed (originalIndex 5) landing in picks 1-4 as a jumper', () => {
    const finalOrder = [0, 1, 5, 2, 3, 4, 6, 7, 8, 9];
    const analysis = analyzeJumps(finalOrder);
    expect(analysis.jumpers.map(j => j.teamIndex)).toEqual([5]);
    expect(analysis.jumpersByPick.get(3)?.fromSeed).toBe(6);
  });

  it('flags a top-4 seed landing at pick 5 or 6 as a faller', () => {
    // picks 1-4: top-4 seeds 0,1,2,3 (no jumpers)
    // pick 5: teamIndex 4 (non-top-4, not a faller)
    // pick 6: teamIndex 0 would be already used; use 3 top-4 seeds in picks 1-3,
    // pick 4: teamIndex 4 (jumper, idx=4 > 3), pick 5: teamIndex 3 (top-4 faller), pick 6: teamIndex 5
    // Simplest: 3 top-4 seeds + 1 non-top-4 in picks 1-4; 1 top-4 seed falls to pick 6 only
    // finalOrder: idx0=1 idx1=2 idx2=3 idx3=5(jumper) idx4=4(not faller) idx5=0(faller)
    const finalOrder = [1, 2, 3, 5, 4, 0, 6, 7, 8, 9];
    const analysis = analyzeJumps(finalOrder);
    const faller = analysis.fallers.find(f => f.teamIndex === 0);
    expect(faller).toBeDefined();
    expect(faller).toMatchObject({ teamIndex: 0, pick: 6, fromSeed: 1 });
    expect(analysis.hasChaos).toBe(true);
  });

  it('reports hasChaos=false when no upsets occurred', () => {
    const finalOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const analysis = analyzeJumps(finalOrder);
    expect(analysis.jumpers).toEqual([]);
    expect(analysis.fallers).toEqual([]);
    expect(analysis.hasChaos).toBe(false);
  });

  it('ignores non-lottery (locked) positions (picks 7-10)', () => {
    const finalOrder = [0, 1, 2, 3, 4, 5, 9, 8, 7, 6];
    const analysis = analyzeJumps(finalOrder);
    expect(analysis.jumpers).toEqual([]);
    expect(analysis.fallers).toEqual([]);
  });

  it('handles multiple jumpers and multiple fallers in the same draw', () => {
    // Both 5th (idx 4) and 6th (idx 5) seeds jump into picks 1-4
    // Both 1st (idx 0) and 2nd (idx 1) seeds fall to picks 5-6
    const finalOrder = [4, 5, 2, 3, 0, 1, 6, 7, 8, 9];
    const analysis = analyzeJumps(finalOrder);
    expect(analysis.jumpers).toHaveLength(2);
    expect(analysis.fallers).toHaveLength(2);
    expect(analysis.hasChaos).toBe(true);
    expect(analysis.jumpersByPick.get(1)?.teamIndex).toBe(4);
    expect(analysis.jumpersByPick.get(2)?.teamIndex).toBe(5);
    expect(analysis.fallersByPick.get(5)?.teamIndex).toBe(0);
    expect(analysis.fallersByPick.get(6)?.teamIndex).toBe(1);
  });

  it('hasChaos is true when only fallers exist (no jumpers)', () => {
    // picks 1-4: all top-4 seeds (0,1,2,3) — no jumpers
    // pick 5: teamIndex 3 (top-4 → faller), pick 6: teamIndex 4 (non-top-4, not a faller)
    // But 3 is used at pick 4 already; use distinct indices:
    // finalOrder: idx0=0, idx1=1, idx2=2, idx3=5(jumper)... — hard to get pure fallers only.
    // Pure faller scenario: top-4 seeds fill picks 1-4 but one top-4 seed ends at pick 5.
    // With 10 teams: 4 top-4 (idx 0-3), picks 1-4 use exactly 4 slots.
    // For one to fall, a non-top-4 must take one pick-1-4 slot (making a jumper).
    // Pure faller (no jumper) is only possible if the top-4 count < 4.
    // In the standard 10-team config this means: one top-4 seed gets pick 5 AND
    // another non-top-4 gets pick 4 (= jumper). So pure-faller-only is actually
    // structurally impossible in the 10-team config without a jumper.
    // Test the realistic case: 1 faller with 1 jumper, hasChaos still true.
    const finalOrder = [0, 1, 2, 4, 3, 5, 6, 7, 8, 9]; // teamIdx 4 at pick 4 (jumper), teamIdx 3 at pick 5 (faller)
    const analysis = analyzeJumps(finalOrder);
    expect(analysis.jumpers).toHaveLength(1);
    expect(analysis.fallers).toHaveLength(1);
    expect(analysis.fallers[0]).toMatchObject({ teamIndex: 3, pick: 5, fromSeed: 4 });
    expect(analysis.hasChaos).toBe(true);
  });
});
