// lib/league.ts
import type { TeamConfig } from './lottery/types';

export const TEAM_LABELS: readonly string[] = [
  '10th Seed', '9th Seed', '8th Seed', '7th Seed',
  '6th Seed', '5th Seed', '4th Seed', '3rd Place',
  '2nd Place', 'Champion',
];

// Values from C:\Users\lucas\dev\tpdl-lottery\js\lottery.js:27-38.
export const TEAM_NAME_OPTIONS: readonly string[] = [
  "Bradley's Bandits",
  "Buttar's Barbarians",
  "Cyr's Beers",
  "Darcy's Demons",
  "Lu's Lazers",
  "Moe's Hoes",
  "Sith's Nips",
  "Sleepy's Steppaz",
  "Teezy's Turtles",
  "Zim's Sims",
];

export const TPDL_COMBINATIONS: readonly number[] = [224, 224, 224, 224, 60, 45, 0, 0, 0, 0];

export function buildTeams(names: readonly string[]): TeamConfig[] {
  if (names.length !== 10) throw new Error(`expected 10 team names, got ${names.length}`);
  return names.map((name, i) => ({
    name,
    originalIndex: i,
    combinations: TPDL_COMBINATIONS[i],
  }));
}
