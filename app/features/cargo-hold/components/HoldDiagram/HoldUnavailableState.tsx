import React from "react";
import { LuPackageX, LuTriangleAlert } from "react-icons/lu";

export type HoldGap = "uncurated" | "failed";

type Props = {
  gap: HoldGap;
  type?: string;
};

const COPY: Record<HoldGap, { title: string; body: string }> = {
  uncurated: {
    title: "No hold configuration",
    body: "Load on this airframe type is reported by weight and volume, without positions or compartments.",
  },
  failed: {
    title: "Hold configuration unavailable",
    body: "The configuration did not load. Reload to try again.",
  },
};

export function HoldUnavailableState({ gap, type }: Props) {
  const { title, body } = COPY[gap];
  const Icon = gap === "uncurated" ? LuPackageX : LuTriangleAlert;

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-gray-50 px-6 py-10 text-center dark:bg-gray-800">
      <Icon aria-hidden={true} className="size-7 text-gray-400 dark:text-gray-500" />
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
        {title}
        {type !== undefined && gap === "uncurated" ? ` for ${type}` : ""}
      </p>
      <p className="max-w-prose text-sm text-gray-500 dark:text-gray-400">{body}</p>
    </div>
  );
}
