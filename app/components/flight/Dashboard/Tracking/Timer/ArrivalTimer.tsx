"use client";

import { FilledSchedule } from "~/models";
import { formatTimeInterval, secondsToNow, timeDiff } from "~/functions/time";
import { useEffect, useState } from "react";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";

type ArrivalTimerProps = {
  schedule: FilledSchedule;
  actual: FilledSchedule;
};

function timeToColor(time: number): string {
  if (time > 5 * 60) {
    return "text-green-500";
  }

  if (time > 0) {
    return "text-yellow-500";
  }

  return "text-green-500";
}

export function ArrivalTimer({ schedule, actual }: ArrivalTimerProps) {
  const timeToArrival = secondsToNow(schedule.arrivalTime);
  const [timeLeft, setTimeLeft] = useState<number>(timeToArrival);

  const estimatedBlockTime = timeDiff(
    schedule.takeoffTime,
    schedule.arrivalTime,
  );
  const calculatedArrivalTime = new Date(
    actual.takeoffTime.getTime() + estimatedBlockTime * 1000,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(secondsToNow(schedule.arrivalTime));
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
      <div className="mb-3 text-center">
        <span className="block text-2xl font-bold text-gray-800 dark:text-gray-100">
          <FormattedIcaoDate date={calculatedArrivalTime} /> &bull;{" "}
          <FormattedIcaoTime date={calculatedArrivalTime} />
        </span>
        <span className="block text-sm">calculated arrival time</span>
      </div>
      <div className="text-center">
        <span className="block text-2xl font-bold text-gray-800 dark:text-gray-100">
          <FormattedIcaoDate date={schedule.onBlockTime} /> &bull;{" "}
          <FormattedIcaoTime date={schedule.onBlockTime} />
        </span>
        <span className="block text-sm">scheduled arrival time</span>
      </div>
    </>
  );
}
