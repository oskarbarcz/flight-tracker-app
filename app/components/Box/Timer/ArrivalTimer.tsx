"use client";

import { FilledSchedule } from "~/models";
import { formatDate, formatTimeInterval, secondsToNow } from "~/functions/time";
import { useEffect, useState } from "react";

type ArrivalTimerProps = {
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

export function ArrivalTimer({ schedule }: ArrivalTimerProps) {
  const timeToArrival = secondsToNow(new Date(schedule.arrivalTime));
  const [timeLeft, setTimeLeft] = useState<number>(timeToArrival);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(secondsToNow(new Date(schedule.arrivalTime)));
    }, 1000);

    return () => clearInterval(interval);
  }, [schedule.arrivalTime]);

  return (
    <>
      <div className="mb-4 text-center">
        <span className={`block text-4xl font-bold ${timeToColor(timeLeft)}`}>
          {formatTimeInterval(timeLeft)}
        </span>
        <span className="block text-sm">time to arrival</span>
      </div>
      <div className="text-center">
        <span className="block text-2xl font-bold text-gray-800 dark:text-gray-100">
          {formatDate(new Date(schedule.arrivalTime))}
        </span>
        <span className="block text-sm">scheduled arrival time</span>
      </div>
    </>
  );
}
