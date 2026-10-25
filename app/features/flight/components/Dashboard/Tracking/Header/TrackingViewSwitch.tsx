import React from "react";
import { twMerge } from "tailwind-merge";
import type { TrackingViewState } from "~/features/flight/hooks/useTrackingView";
import { TrackingView } from "~/features/flight/lib/trackingView";

const VIEWS: { view: TrackingView; label: string }[] = [
  { view: TrackingView.Briefing, label: "Briefing" },
  { view: TrackingView.Monitor, label: "Monitor" },
];

type Props = {
  trackingView: TrackingViewState;
  className?: string;
};

export function TrackingViewSwitch({ trackingView, className }: Props) {
  return (
    <fieldset
      aria-label="Tracking view"
      className={twMerge(
        "flex min-w-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700",
        className,
      )}
    >
      {VIEWS.map(({ view, label }, index) => {
        const active = trackingView.view === view;

        return (
          <button
            key={view}
            type="button"
            aria-pressed={active}
            onClick={() => trackingView.select(view)}
            className={twMerge(
              "h-9 flex-1 cursor-pointer px-4 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 pointer-coarse:h-11 dark:focus-visible:ring-indigo-400",
              index > 0 && "border-s border-gray-200 dark:border-gray-700",
              active
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                : "bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
            )}
          >
            {label}
          </button>
        );
      })}
    </fieldset>
  );
}
