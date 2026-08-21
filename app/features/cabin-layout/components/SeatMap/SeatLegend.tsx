import React from "react";
import { twMerge } from "tailwind-merge";
import {
  CONDITION_LABELS,
  type SeatCondition,
  type SeatMode,
  seatCondition,
} from "~/features/cabin-layout/lib/seatAppearance";
import type { CabinSeat } from "~/features/cabin-layout/model";

type Props = {
  seats: CabinSeat[];
  mode: SeatMode;
};

function presentConditions(seats: CabinSeat[]): SeatCondition[] {
  const present = new Set<SeatCondition>();
  for (const seat of seats) {
    const condition = seatCondition(seat);
    if (condition !== null) {
      present.add(condition);
    }
  }
  return [...present];
}

function Swatch({ className }: { className: string }) {
  return <span aria-hidden={true} className={twMerge("size-2.5 shrink-0 rounded-xs border", className)} />;
}

export function SeatLegend({ seats, mode }: Props) {
  const conditions = presentConditions(seats);
  const hasReversed = seats.some((seat) => seat.reversed);

  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
      {mode.legend(seats).map((entry) => (
        <li key={entry.key} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Swatch className={entry.fill} />
          {entry.label}
        </li>
      ))}
      {conditions.map((condition) => (
        <li key={condition} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Swatch className="border-gray-400 bg-gray-100 dark:border-gray-500 dark:bg-gray-700" />
          {CONDITION_LABELS[condition]}
        </li>
      ))}
      {hasReversed && (
        <li className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span
            aria-hidden={true}
            className="flex size-2.5 shrink-0 items-center rounded-xs border border-gray-400 bg-gray-100 dark:border-gray-500 dark:bg-gray-700"
          >
            <span className="h-full w-[3px] bg-gray-900 dark:bg-gray-100" />
          </span>
          Rearward facing
        </li>
      )}
    </ul>
  );
}
