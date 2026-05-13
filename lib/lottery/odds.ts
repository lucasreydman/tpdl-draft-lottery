// lib/lottery/odds.ts
// TPDL hardcoded odds verified by 5M Monte Carlo simulations in the original app.
// Source: js/lottery.js:75-82 in the original tpdl-lottery repo.
// Original values are percentages; this module stores them as fractions.
// Index [originalIndex][pickPosition - 1]. originalIndex 0 = 10th seed (worst).
// Only lottery-eligible teams (originalIndex 0-5) have non-zero odds.

export const TPDL_ODDS: readonly (readonly number[])[] = [
  // pick:    1      2      3      4      5      6
  [0.224, 0.219, 0.210, 0.191, 0.157, 0.000], // 10th seed (originalIndex 0)
  [0.224, 0.218, 0.209, 0.191, 0.147, 0.009], // 9th  seed
  [0.224, 0.219, 0.209, 0.191, 0.138, 0.019], // 8th  seed
  [0.224, 0.219, 0.210, 0.191, 0.128, 0.028], // 7th  seed
  [0.060, 0.072, 0.092, 0.133, 0.430, 0.213], // 6th  seed
  [0.044, 0.054, 0.070, 0.103, 0.000, 0.730], // 5th  seed
] as const;
