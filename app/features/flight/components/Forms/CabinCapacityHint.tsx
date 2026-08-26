import React from "react";
import { HiExclamationTriangle } from "react-icons/hi2";
import type { CabinCapacity } from "~/features/flight/hooks/useCabinCapacity";

type Props = {
  capacity: CabinCapacity;
  passengers: number;
};

export function CabinCapacityHint({ capacity, passengers }: Props) {
  if (passengers <= capacity.totalSeats) {
    return null;
  }

  return (
    <p className="flex items-start gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
      <HiExclamationTriangle className="mt-0.5 size-3.5 shrink-0" />
      <span>
        {`Above capacity: ${passengers} passengers in a cabin of ${capacity.totalSeats} seats (${capacity.layoutId}).`}
      </span>
    </p>
  );
}
