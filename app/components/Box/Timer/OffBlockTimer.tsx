"use client";

import { FilledSchedule } from "~/models";
import { formatDate, formatTimeInterval, secondsToNow } from "~/functions/time";
import { useEffect, useState } from "react";

type OffBlockTimerProps = {
  schedule: FilledSchedule;
};

function timeToColor(time: number): string {
  if (time > 5 * 60) {
    return "text-green-500";
  }

  if (time > 0) {
    return "text-yellow-500";
  }

  return "text-red-500";
}

export function OffBlockTimer({ schedule }: OffBlockTimerProps) {
  const timeToOffBlock = secondsToNow(new Date(schedule.offBlockTime));
  const [timeLeft, setTimeLeft] = useState<number>(timeToOffBlock);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(secondsToNow(new Date(schedule.offBlockTime)));
    }, 1000);

    return () => clearInterval(interval);
  }, [schedule.offBlockTime]);

  return (
    <>
      <div className="mb-4 text-center">
        <span className={`block text-4xl font-bold ${timeToColor(timeLeft)}`}>
          {formatTimeInterval(timeLeft)}
        </span>
        <span className="block text-sm">time to off-block</span>
      </div>
      <div className="text-center">
        <span className="block text-2xl font-bold text-gray-800 dark:text-gray-100">
          {formatDate(new Date(schedule.offBlockTime))}
        </span>
        <span className="block text-sm">scheduled off-block time</span>
      </div>
    </>
  );
}
