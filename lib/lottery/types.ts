// lib/lottery/types.ts

export type TeamConfig = {
  name: string;
  originalIndex: number;
  combinations: number;
};

export type DrawEventLottery  = { kind: 'lottery';  pick: 1 | 2 | 3 | 4; teamIndex: number };
export type DrawEventByRecord = { kind: 'byRecord'; pick: 5 | 6;          teamIndex: number };
export type DrawEventLocked   = { kind: 'locked';   pick: 7 | 8 | 9 | 10; teamIndex: number };
export type DrawEvent = DrawEventLottery | DrawEventByRecord | DrawEventLocked;

export type LotteryConfig = {
  teams: TeamConfig[];
};

export type DrawResult = {
  finalOrder: number[];
  drawSequence: DrawEvent[];
};

export type LotteryResult = DrawResult & {
  id: string;
  createdAt: number;
  label: string;
  teams: TeamConfig[];
  pickOwnership: string[][];
};

export type RNG = () => number;
