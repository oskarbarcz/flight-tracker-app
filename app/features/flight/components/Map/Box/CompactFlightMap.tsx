import React, { Suspense } from "react";
import { LuMaximize2 } from "react-icons/lu";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import type { Flight, FlightPathElement } from "~/features/flight";
import { TrackingView, trackFlightPath } from "~/features/flight/lib/trackingView";
import { MapAttribution } from "~/shared/ui/Map/MapAttribution";

const CompactGlobeMap = React.lazy(() =>
  import("~/features/flight/components/Map/Box/CompactGlobeMap").then((module) => ({
    default: module.CompactGlobeMap,
  })),
);

type Props = {
  flight: Flight;
  path: FlightPathElement[];
  className?: string;
};

export function CompactFlightMap({ flight, path, className }: Props) {
  return (
    <div className={twMerge("group relative isolate overflow-hidden", className)}>
      <div inert className="absolute inset-0">
        <Suspense fallback={<div className="h-full w-full animate-pulse bg-gray-100 dark:bg-gray-900" />}>
          <CompactGlobeMap flight={flight} path={path} />
        </Suspense>
      </div>

      <Link
        to={trackFlightPath(flight.id, TrackingView.Tracking)}
        viewTransition
        aria-label={`Open the tracking map for ${flight.flightNumber}`}
        className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
      >
        <span className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition-colors group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-700 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:group-hover:border-indigo-800 dark:group-hover:bg-gray-800 dark:group-hover:text-indigo-300">
          <LuMaximize2 className="size-4" aria-hidden={true} />
        </span>
      </Link>

      <MapAttribution className="z-20" />
    </div>
  );
}
