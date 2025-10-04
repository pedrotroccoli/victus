import { differenceInMilliseconds, differenceInSeconds } from "date-fns";
import { AlarmClockPlus, Pause, Play, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ClockTime, TimeBlock } from "./types";
import { convertDateToClockTime, getSumOfTimeBlocksInMiliseconds, transformMilisecondsToClockTime } from "./utils";
import { useLocalStorage } from "@uidotdev/usehooks";

export const pad2 = (value: number) => {
  return value.toString().slice(-2).padStart(2, '0');
}

export const TimerClock = () => {
  const [blocks, setBlocks] = useLocalStorage<TimeBlock[]>('@victus-web-app-blocks', []);
  const [time, setTime] = useState<ClockTime>(() => {
    if (blocks.length > 0) {
      return transformMilisecondsToClockTime(getSumOfTimeBlocksInMiliseconds(blocks));
    }

    return {
      allMilisecondsBefore: 0,
      day: 0,
      seconds: 0,
      minutes: 0,
      hours: 0,
      milliseconds: 0,
    }
  });
  const interval = useRef<NodeJS.Timeout | null>(null);

  const formattedTime = useMemo(() => {
    return `${pad2(time.hours)}:${pad2(time.minutes)}:${pad2(time.seconds)}`;
  }, [time]);

  const started = useMemo(() => {
    return blocks.length > 0 && blocks[blocks.length - 1].type === 'started';
  }, [blocks]);

  const tick = (initialDiff: number = 0, initialDate: Date) => {
    setTime(prev => ({
      ...prev,
      ...convertDateToClockTime({
        accumulated: initialDiff,
        start: initialDate,
        end: new Date(),
      }),
    }));
  }

  useEffect(() => {
    if (started && !interval.current) {
      console.log(blocks, 
        'started-use-effect',
      );

      const allTimeBefore = getSumOfTimeBlocksInMiliseconds(blocks.slice(0, -1));

      const realStartedAt = new Date(blocks[blocks.length - 1].startedAt);

      tick(allTimeBefore, realStartedAt);

      interval.current = setInterval(() => {
        tick(allTimeBefore, realStartedAt);
      }, 1);
    }
  }, [blocks]);

  const start = () => {
    console.log(blocks);

    const allTimeBefore = getSumOfTimeBlocksInMiliseconds(blocks);
    const startedAt = new Date();

    setBlocks((prev) => [...prev, { type: 'started', startedAt, finishedAt: null }]);

    tick(allTimeBefore, startedAt);

    interval.current = setInterval(() => {
      tick(allTimeBefore, startedAt);
    }, 1);

    return () => clearInterval(interval.current ?? undefined);
  }

  const stop = () => {

    clearInterval(interval.current ?? undefined);
    interval.current = null;

    const last = blocks.slice().pop();

    const newBlocks = [
      ...blocks.slice(0, -1),
      {
        ...last,
        finishedAt: new Date(),
        type: 'finished',
      }
    ]

    console.log(newBlocks);

    setBlocks(newBlocks as TimeBlock[]);
  }

  const clear = () => {
    clearInterval(interval.current ?? undefined);
    interval.current = null;

    setBlocks([]);
    setTime({
      allMilisecondsBefore: 0,
      day: 0,
      seconds: 0,
      minutes: 0,
      hours: 0,
      milliseconds: 0,
    });
  }

  const addTurn = () => {
    setBlocks((prev) => [...prev, { type: 'started', startedAt: new Date(), finishedAt: null }]);
  }

  return (
    <div>
      <div className="w-48 h-48 bg-neutral-200 rounded-full p-2">
        <button className="w-full h-full bg-neutral-100 rounded-full border border-neutral-300 flex flex-col items-center justify-center gap-4 relative" onClick={started ? stop : start}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <p className="text-[1.2rem]">{formattedTime}</p>
          </div>
          <div className="absolute top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2">
            {started ? <Pause /> : <Play />}
          </div>
        </button>
        <div>
          <button className="" onClick={clear}> 
            <Trash2 size={24} />
          </button>
<button className="" onClick={addTurn}> 
            <AlarmClockPlus size={24} />
          </button>

        </div>
      </div>
    </div>
  );
}