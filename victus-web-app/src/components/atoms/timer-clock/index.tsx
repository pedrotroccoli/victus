import { differenceInMilliseconds } from "date-fns";
import { Pause, Play, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClockTime, TimeBlock } from "./types";
import { convertDateToClockTime, getSumOfTimeBlocksInMiliseconds, startTimer, stopTimer, transformMilisecondsToClockTime } from "./utils";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Button } from "@/components/ions/button";

export const pad2 = (value: number) => {
  return value.toString().slice(-2).padStart(2, '0');
}

interface TimerClockProps {
  size?: 'xsm' | 'sm' | 'md' | 'lg';
  onSave?: (blocks: TimeBlock[]) => void;
}

const sizeMap = {
  xsm: 0.6,
  sm: 0.7,
  md: 1,
  lg: 1.3,
}


export const TimerClock = ({ size = 'md' }: TimerClockProps) => {
  const [turn, setTurn] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);
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
  // @ts-ignore
  const [turns, setTurns] = useState([]);

  const formattedTime = useMemo(() => {
    return `${pad2(time.hours)}:${pad2(time.minutes)}:${pad2(time.seconds)}`;
  }, [time]);

  const getSumOfBlocksInMiliseconds = (blocks: TimeBlock[]) => {
    return blocks.reduce((acc, block) => {
      return acc + differenceInMilliseconds(block.finishedAt ?? new Date(), block.startedAt);
    }, 0);
  }

  const getLastBlock = (blocks: TimeBlock[]) => {
    return blocks[blocks.length - 1];
  }

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
      const allTimeBefore = getSumOfBlocksInMiliseconds(blocks);

      const realStartedAt = new Date(getLastBlock(blocks).startedAt);

      tick(allTimeBefore, realStartedAt);

      interval.current = setInterval(() => {
        tick(allTimeBefore, realStartedAt);
      }, 1);
    }
  }, [blocks]);

  const clear = () => {
    clearInterval(interval.current ?? undefined);
    interval.current = null;

    setStarted(false);
    setTurns([]);
    setTurn(0);
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

  const toggleStartStop = () => {
    if (started) {
      const newBlocks = stopTimer({ blocksToStop: blocks, interval: interval.current }) as TimeBlock[];

      setBlocks(newBlocks);

      // @ts-ignore
      setTurns(Object.entries(Object.groupBy(newBlocks, (item) => item.turn)));

      interval.current = null;

      setStarted(false);

      return;
    }

    const startedAt = new Date();

    const newBlocks = startTimer({ newTurn: true, blocksToStart: blocks, startedAt, turn: turn });

    setBlocks(newBlocks);

    const allTimeBefore = getSumOfBlocksInMiliseconds(blocks);

    tick(allTimeBefore, startedAt);

    interval.current = setInterval(() => {
      tick(allTimeBefore, startedAt);
    }, 1);
  
    setStarted(true);
  }

  const addTurn = () => {
    const oldBlocks = stopTimer({ blocksToStop: blocks, interval: interval.current }) as TimeBlock[];

    // @ts-ignore
    const turns = Object.entries(Object.groupBy(oldBlocks, (item) => item.turn))

    console.log(oldBlocks, turns);

    // @ts-ignore
    setTurns(turns);

    const startedAt = new Date();

    const newBlocks = startTimer({ 
      startedAt,
      newTurn: true, 
      turn: turn + 1,
      blocksToStart: oldBlocks,
    });
    
    setBlocks(newBlocks);
    setTurn(turn + 1);

    interval.current = null;

    const allTimeBefore = getSumOfBlocksInMiliseconds(oldBlocks);

    tick(allTimeBefore, startedAt);

    interval.current = setInterval(() => {
      tick(allTimeBefore, startedAt);
    }, 1);
  }

  return (
    <div className="flex gap-4 justify-start bg-red-200">
      <div className="flex items-center flex-col">
        <div className="w-48 h-48 bg-neutral-200 rounded-full p-2 relative" style={{ scale: sizeMap[size] }}>
          <button className="w-full h-full bg-neutral-100 rounded-full border border-neutral-300 flex flex-col items-center justify-center gap-4" 
          onClick={toggleStartStop}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <p className="text-[1.2rem]">{formattedTime}</p>
            </div>
            <div className="absolute top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2">
              {started ? <Pause /> : <Play />}
            </div>
          </button>
        </div>
          <div className="flex gap-2 justify-center mt-4">
            <Button className="" onClick={clear} variant="outline" iconLeft={Trash2} size="sm"> 
              Resetar
            </Button>
            {/* <Button className="" onClick={addTurn} iconLeft={AlarmClockPlus} size="sm"> 
              Novo Giro
            </Button> */}
            <Button className="" onClick={addTurn} iconLeft={Save} size="sm"> 
              Salvar
            </Button>
          </div>
      </div>
      {/* {turns?.length > 0 && (
        <ul>
          {turns.map(([turnNumber, turnBlocks], index) => {
            const totalTime = turnBlocks?.reduce((acc, block) => acc + differenceInSeconds(block.finishedAt ?? new Date(), block.startedAt), 0);

            return (
            <li key={turnNumber}>
              <p>Bloco {index + 1} - {totalTime}</p>
            </li>
          )
          })}
        </ul>
      )} */}
    </div>
  );
}