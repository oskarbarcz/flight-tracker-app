"use client";

import { FilledSchedule } from "~/models";
import { getHourFromDate } from "~/functions/time";

type SummaryTimerProps = {
  schedule: FilledSchedule;
  actual: FilledSchedule;
};
export function SummaryTimer({ actual }: SummaryTimerProps) {
  return (
    <>
      <div className="flex flex-row flex-wrap">
        <div className="my-2 w-1/2 text-center">
          <span className="block text-4xl font-bold">
            {getHourFromDate(actual.offBlockTime)}
          </span>
          <span className="block text-sm">off-block</span>
        </div>
        <div className="my-2 w-1/2 text-center">
          <span className="block text-4xl font-bold">
            {getHourFromDate(actual.takeoffTime)}
          </span>
          <span className="block text-sm">takeoff</span>
        </div>
        <div className="my-2 w-1/2 text-center">
          <span className="block text-4xl font-bold">
            {getHourFromDate(actual.arrivalTime)}
          </span>
          <span className="block text-sm">arrival</span>
        </div>
        <div className="my-2 w-1/2 text-center">
          <span className="block text-4xl font-bold">
            {getHourFromDate(actual.onBlockTime)}
          </span>
          <span className="block text-sm">on-block</span>
        </div>
      </div>
    </>
  );
}
