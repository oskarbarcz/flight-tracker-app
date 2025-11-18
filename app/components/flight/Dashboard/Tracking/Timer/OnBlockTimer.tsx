"use client";

import { useEffect, useState } from "react";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { formatTimeInterval, secondsToNow } from "~/functions/time";
import { FilledSchedule } from "~/models";

type OnBlockTimerProps = {
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

export function OnBlockTimer({ schedule }: OnBlockTimerProps) {
  const timeToOnBlock = secondsToNow(schedule.onBlockTime);
  const [timeLeft, setTimeLeft] = useState<number>(timeToOnBlock);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(secondsToNow(schedule.onBlockTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [schedule.onBlockTime]);

  return (
    <>
      <div className="mb-4 text-center">
        <span className={`block text-4xl font-bold ${timeToColor(timeLeft)}`}>
          {formatTimeInterval(timeLeft)}
        </span>
        <span className="block text-sm">time to on-block</span>
      </div>
      <div className="text-center">
        <span className="block text-2xl font-bold text-gray-800 dark:text-gray-100">
          <FormattedIcaoDate date={schedule.onBlockTime} /> &bull;{" "}
          <FormattedIcaoTime date={schedule.onBlockTime} />
        </span>
        <span className="block text-sm">scheduled on-block time</span>
      </div>
    </>
  );
}
