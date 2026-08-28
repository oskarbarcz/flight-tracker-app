import React, { useId } from "react";
import { FaPlane } from "react-icons/fa";

type Props = {
  percent: number;
};

const ARC_PATH = "M0,20 Q50,-12 100,20";

function arcTopPercent(fraction: number): number {
  return 50 - 160 * fraction + 160 * fraction * fraction;
}

export function FlightProgressBar({ percent }: Props) {
  const clipId = useId();
  const progress = Math.min(Math.max(percent, 0), 100);
  const fraction = progress / 100;

  return (
    <div
      role="progressbar"
      aria-label="Flight progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="relative h-10 min-w-0 flex-1"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        aria-hidden={true}
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <rect x="0" y="0" width={fraction} height="1" />
          </clipPath>
        </defs>

        <path
          d={ARC_PATH}
          fill="none"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        <path
          d={ARC_PATH}
          fill="none"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          clipPath={`url(#${clipId})`}
          className="stroke-indigo-500"
        />
      </svg>

      <span className="absolute left-0 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-950" />

      <span className="absolute left-full top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900" />

      <span
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-1 motion-safe:transition-all motion-safe:duration-500 dark:bg-gray-900"
        style={{ left: `${progress}%`, top: `${arcTopPercent(fraction)}%` }}
      >
        <FaPlane className="size-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden={true} />
      </span>
    </div>
  );
}
