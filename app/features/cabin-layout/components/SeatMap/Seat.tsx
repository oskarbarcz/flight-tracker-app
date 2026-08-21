import React from "react";
import { twMerge } from "tailwind-merge";
import { type SeatAppearance, SeatCondition } from "~/features/cabin-layout/lib/seatAppearance";

type Props = {
  designator: string;
  appearance: SeatAppearance;
  condition: SeatCondition | null;
  reversed: boolean;
  isMuted: boolean;
  description: string;
  style: React.CSSProperties;
};

const CONDITION_OVERLAY: Record<SeatCondition, string> = {
  [SeatCondition.Blocked]:
    "bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(17,24,39,0.75)_2px,rgba(17,24,39,0.75)_3.5px)] dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(249,250,251,0.8)_2px,rgba(249,250,251,0.8)_3.5px)]",
  [SeatCondition.CrewRest]:
    "bg-[radial-gradient(circle_at_center,rgba(17,24,39,0.85)_0,rgba(17,24,39,0.85)_28%,transparent_29%)] dark:bg-[radial-gradient(circle_at_center,rgba(249,250,251,0.9)_0,rgba(249,250,251,0.9)_28%,transparent_29%)]",
  [SeatCondition.Unbookable]:
    "bg-[linear-gradient(to_top_right,transparent_calc(50%_-_0.75px),rgba(17,24,39,0.8)_50%,transparent_calc(50%_+_0.75px))] dark:bg-[linear-gradient(to_top_right,transparent_calc(50%_-_0.75px),rgba(249,250,251,0.85)_50%,transparent_calc(50%_+_0.75px))]",
};

const BASE =
  "absolute rounded-[2px] border transition-[scale,box-shadow,opacity] duration-[90ms] ease-out hover:z-10 hover:scale-[1.45] hover:ring-1 hover:ring-gray-900 focus-visible:z-10 focus-visible:scale-[1.45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 motion-reduce:transition-none dark:hover:ring-white";

const classNames = new Map<string, string>();

function seatClassName(fill: string, isMuted: boolean): string {
  const key = `${fill}|${isMuted}`;
  const cached = classNames.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const merged = twMerge(BASE, fill, isMuted && "opacity-20");
  classNames.set(key, merged);
  return merged;
}

function SeatControl({ designator, appearance, condition, reversed, isMuted, description, style }: Props) {
  return (
    <button
      type="button"
      data-seat={designator}
      aria-label={description}
      style={style}
      className={seatClassName(appearance.fill, isMuted)}
    >
      {condition !== null && (
        <span aria-hidden={true} className={twMerge("absolute inset-0 rounded-[1px]", CONDITION_OVERLAY[condition])} />
      )}
      {reversed && (
        <span
          aria-hidden={true}
          className="absolute inset-y-0 left-0 w-[3px] rounded-l-[1px] bg-gray-900 dark:bg-gray-100"
        />
      )}
    </button>
  );
}

export const Seat = React.memo(SeatControl);
