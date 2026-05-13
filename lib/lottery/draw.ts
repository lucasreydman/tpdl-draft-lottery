// lib/lottery/draw.ts
import { drawOnePick, ASSIGNED, TOTAL_POOL } from './combinations';
import type { LotteryConfig, DrawResult, DrawEvent, RNG } from './types';

export function runDraw(config: LotteryConfig, rng: RNG): DrawResult {
  // Validate the config: lottery-eligible combinations must sum to TOTAL_POOL (1001).
  // Teams collectively hold all 1001 slots; drawOnePick discards the 1001st at draw time,
  // leaving exactly 1000 effectively assigned combinations.
  const lotteryEligible = config.teams.filter(t => t.combinations > 0);
  const locked = config.teams.filter(t => t.combinations === 0);
  const sum = lotteryEligible.reduce((acc, t) => acc + t.combinations, 0);
  if (sum !== TOTAL_POOL) {
    throw new Error(`runDraw: combinations must sum to ${TOTAL_POOL}, got ${sum}`);
  }
  if (lotteryEligible.length < 4) {
    throw new Error(`runDraw: need at least 4 lottery-eligible teams, got ${lotteryEligible.length}`);
  }

  const drawn = new Set<number>();
  const events: DrawEvent[] = [];

  // Picks 1-4: lottery
  for (let pick = 1; pick <= 4; pick++) {
    const teamIndex = drawOnePick(lotteryEligible, drawn, rng);
    drawn.add(teamIndex);
    events.push({ kind: 'lottery', pick: pick as 1 | 2 | 3 | 4, teamIndex });
  }

  // Picks 5-6: by reverse record (lowest originalIndex among remaining lottery-eligible)
  const byRecordCandidates = lotteryEligible
    .filter(t => !drawn.has(t.originalIndex))
    .sort((a, b) => a.originalIndex - b.originalIndex);
  events.push({ kind: 'byRecord', pick: 5, teamIndex: byRecordCandidates[0].originalIndex });
  events.push({ kind: 'byRecord', pick: 6, teamIndex: byRecordCandidates[1].originalIndex });

  // Picks 7-10: locked, in standings order (ascending originalIndex)
  const lockedSorted = [...locked].sort((a, b) => a.originalIndex - b.originalIndex);
  lockedSorted.forEach((t, i) => {
    events.push({ kind: 'locked', pick: (7 + i) as 7 | 8 | 9 | 10, teamIndex: t.originalIndex });
  });

  // finalOrder[pick-1] = originalIndex
  const finalOrder = new Array<number>(10);
  events.forEach(e => { finalOrder[e.pick - 1] = e.teamIndex; });

  return { finalOrder, drawSequence: events };
}
