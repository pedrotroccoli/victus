export type Time = {
  day: number;
  seconds: number;
  minutes: number;
  hours: number;
  milliseconds: number;
}

export interface ClockTime extends Time {
  allMilisecondsBefore: number;
}

export interface NormalBlock {
  type: 'started' | 'paused' | 'finished';
  startedAt: Date;
  finishedAt: Date | null;
  turn: number;
}

export type TimeBlock = NormalBlock;
