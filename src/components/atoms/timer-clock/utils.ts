import { differenceInMilliseconds } from "date-fns";
import { ClockTime, TimeBlock } from "./types";

type ConvertDateToClockTime = {
  accumulated?: number;
  start: Date;
  end: Date;
}

export const transformMilisecondsToClockTime = (miliseconds: number): ClockTime => {
  const seconds = Math.floor(miliseconds / 1000);
  const beforeDays = Math.floor(seconds / 86400);
  const beforeHours = Math.floor((seconds % 86400) / 3600);
  const beforeMinutes = Math.floor((seconds % 3600) / 60);
  const beforeSeconds = Math.floor(seconds % 60);

  return {
    allMilisecondsBefore: miliseconds,
    day: beforeDays || 0,
    seconds: beforeSeconds || 0,
    minutes: beforeMinutes || 0,
    hours: beforeHours || 0,
    milliseconds: miliseconds % 1000,
  };
}

export const convertDateToClockTime = ({
  accumulated = 0,
  start,
  end,
}: ConvertDateToClockTime): ClockTime => {
  if (typeof accumulated !== 'number') {
    throw new Error(`Accumulated must be a number, got ${typeof accumulated}`);
  }

  if (!(start instanceof Date)) {
    throw new Error(`Start must be a date, got ${typeof start}`);
  }

  if (!(end instanceof Date)) {
    throw new Error(`End must be a date, got ${typeof end}`);
  }

  const diff = differenceInMilliseconds(end, start) + accumulated;

  return transformMilisecondsToClockTime(diff);
};


export const getSumOfTimeBlocksInMiliseconds = (receivedBlocks: TimeBlock[]) => {
  return receivedBlocks.reduce((acc, block) => {
    return acc + differenceInMilliseconds(block.finishedAt ?? new Date(), block.startedAt);
  }, 0);
};