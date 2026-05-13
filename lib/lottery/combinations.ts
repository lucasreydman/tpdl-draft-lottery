// lib/lottery/combinations.ts
import type { TeamConfig, RNG } from './types';

export const TOTAL_POOL = 1001;
export const ASSIGNED = 1000;

/**
 * Draw one pick using the NBA-style 1001-combination lottery mechanic.
 *
 * Algorithm:
 *  1. Roll a uniform integer in [0, TOTAL_POOL) via rng().
 *  2. If roll >= ASSIGNED (1000), it's the single discarded combo → redraw.
 *  3. Walk teams in order, accumulating their combination counts.
 *     The roll falls into the first team whose cumulative cursor exceeds it.
 *  4. If that team has already been picked (present in alreadyPicked), redraw.
 *  5. Otherwise return team.originalIndex.
 *
 * @param teams        Ordered list of lottery-eligible teams with combination counts.
 *                     The sum of all combinations must equal ASSIGNED (1000).
 * @param alreadyPicked Set of originalIndex values that have already won a pick.
 * @param rng          Seeded/deterministic RNG that returns a float in [0, 1).
 * @returns            The originalIndex of the team that wins this pick.
 */
export function drawOnePick(
  teams: TeamConfig[],
  alreadyPicked: ReadonlySet<number>,
  rng: RNG,
): number {
  while (true) {
    const roll = Math.floor(rng() * TOTAL_POOL);

    if (roll >= ASSIGNED) continue; // discarded combo — redraw

    let cursor = 0;
    for (const team of teams) {
      cursor += team.combinations;
      if (roll < cursor) {
        if (alreadyPicked.has(team.originalIndex)) break; // team already has a pick — redraw
        return team.originalIndex;
      }
    }
    // If we fell through (shouldn't happen with valid input), loop again
  }
}
