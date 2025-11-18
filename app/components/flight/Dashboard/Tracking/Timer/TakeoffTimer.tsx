"use client";

import { FilledSchedule } from "~/models";
import { formatTimeInterval, secondsToNow } from "~/functions/time";
import { useEffect, useState } from "react";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";

type TakeoffTimerProps = {
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

export function TakeoffTimer({ schedule }: TakeoffTimerProps) {
  const timeToTakeoff = secondsToNow(schedule.takeoffTime);
  const [timeLeft, setTimeLeft] = useState<number>(timeToTakeoff);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(secondsToNow(schedule.takeoffTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [schedule.takeoffTime]);

  return (
    <>
      <div className="mb-4 text-center">
        <span className={`block text-4xl font-bold ${timeToColor(timeLeft)}`}>
          {formatTimeInterval(timeLeft)}
        </span>
        <span className="block text-sm">time to takeoff</span>
      </div>
      <div className="text-center">
        <span className="block text-2xl font-bold text-gray-800 dark:text-gray-100">
          <FormattedIcaoTime date={schedule.takeoffTime} />
        </span>
        <span className="block text-sm">scheduled takeoff time</span>
      </div>
    </>
  );
}
