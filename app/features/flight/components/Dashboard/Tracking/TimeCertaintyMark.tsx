import React from "react";
import type { IconType } from "react-icons";
import { LuCalendarClock, LuTimer } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

export type TimeCertainty = "estimated" | "scheduled";

const MARKS: Record<TimeCertainty, { icon: IconType; label: string }> = {
  scheduled: { icon: LuCalendarClock, label: "Scheduled" },
  estimated: { icon: LuTimer, label: "Estimated" },
};

type Props = {
  certainty: TimeCertainty;
  className?: string;
};

export function TimeCertaintyMark({ certainty, className }: Props) {
  const { icon: Icon, label } = MARKS[certainty];

  return (
    <span title={label} className={twMerge("inline-flex shrink-0 align-[-0.125em]", className)}>
      <Icon className="size-[1em]" aria-hidden={true} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
