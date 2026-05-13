// lib/lottery/jumps.ts
// Port of analyzeLotteryJumps from the original js/lottery.js:598-621.
// originalIndex 0 = worst (10th) seed; 3 = 7th seed; 4 = 6th; 5 = 5th.

export type Jumper = { teamIndex: number; pick: number; fromSeed: number };
export type Faller = { teamIndex: number; pick: number; fromSeed: number };

export type JumpAnalysis = {
  jumpers: Jumper[];
  fallers: Faller[];
  jumpersByPick: Map<number, Jumper>;
  fallersByPick: Map<number, Faller>;
  hasChaos: boolean;
};

const TOP_FOUR_SEED_MAX = 3; // originalIndex inclusive upper bound for "top-4 lottery seeds"

export function analyzeJumps(finalOrder: number[]): JumpAnalysis {
  const jumpers: Jumper[] = [];
  const fallers: Faller[] = [];

  finalOrder.forEach((teamIndex, idx) => {
    const pick = idx + 1;
    if (idx < 4 && teamIndex > TOP_FOUR_SEED_MAX) {
      jumpers.push({ teamIndex, pick, fromSeed: teamIndex + 1 });
    }
    if ((idx === 4 || idx === 5) && teamIndex <= TOP_FOUR_SEED_MAX) {
      fallers.push({ teamIndex, pick, fromSeed: teamIndex + 1 });
    }
  });

  return {
    jumpers,
    fallers,
    jumpersByPick: new Map(jumpers.map((j) => [j.pick, j])),
    fallersByPick: new Map(fallers.map((f) => [f.pick, f])),
    hasChaos: jumpers.length > 0 || fallers.length > 0,
  };
}
