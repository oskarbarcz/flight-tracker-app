import React from "react";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import type { TrackingViewState } from "~/features/flight/hooks/useTrackingView";
import { TrackingView } from "~/features/flight/lib/trackingView";

const VIEWS: { view: TrackingView; label: string }[] = [
  { view: TrackingView.Briefing, label: "Briefing" },
  { view: TrackingView.Tracking, label: "Tracking" },
];

type Props = {
  trackingView: TrackingViewState;
  className?: string;
};

export function TrackingViewSwitch({ trackingView, className }: Props) {
  const activeIndex = VIEWS.findIndex(({ view }) => view === trackingView.view);

  return (
    <nav
      aria-label="Tracking view"
      className={twMerge(
        "relative grid min-w-0 grid-cols-2 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900",
        className,
      )}
    >
      <span
        aria-hidden={true}
        className="absolute inset-y-0 left-0 w-1/2 bg-indigo-50 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none dark:bg-indigo-500/15"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {VIEWS.map(({ view, label }, index) => {
        const active = index === activeIndex;

        return (
          <Link
            key={view}
            to={trackingView.pathTo(view)}
            viewTransition
            aria-current={active ? "page" : undefined}
            className={twMerge(
              "relative flex h-9 items-center justify-center px-4 text-sm font-semibold transition-colors duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 pointer-coarse:h-11 dark:focus-visible:ring-indigo-400",
              index > 0 && "border-s border-gray-200 dark:border-gray-700",
              active
                ? "text-indigo-700 dark:text-indigo-300"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
