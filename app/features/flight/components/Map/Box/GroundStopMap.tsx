import React, { type RefObject, Suspense, useEffect, useRef, useState } from "react";
import { LuMaximize2 } from "react-icons/lu";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import type { Airport } from "~/features/airport";
import type { AirportLayout } from "~/features/airport/hooks/useAirportLayout";
import type { Operator } from "~/features/operator";
import { MapAttribution } from "~/shared/ui/Map/MapAttribution";

const GroundStopGlobeMap = React.lazy(() =>
  import("~/features/flight/components/Map/Box/GroundStopGlobeMap").then((module) => ({
    default: module.GroundStopGlobeMap,
  })),
);

export type ParkedAircraft = {
  registration: string;
  operator: Pick<Operator, "icaoCode" | "shortName">;
};

function useHasSize(frame: RefObject<HTMLDivElement | null>): boolean {
  const [hasSize, setHasSize] = useState(false);

  useEffect(() => {
    if (!frame.current) return;

    const observer = new ResizeObserver(([entry]) => setHasSize(entry.contentRect.width > 0));
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, [frame]);

  return hasSize;
}

type Props = {
  airport: Airport;
  layout: AirportLayout;
  aircraft: ParkedAircraft | null;
  className?: string;
};

export function GroundStopMap({ airport, layout, aircraft, className }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const hasSize = useHasSize(frame);

  return (
    <div className={twMerge("group relative isolate overflow-hidden", className)}>
      <div ref={frame} inert className="absolute inset-0">
        {hasSize && (
          <Suspense fallback={<div className="h-full w-full animate-pulse bg-gray-100 dark:bg-gray-900" />}>
            <GroundStopGlobeMap airport={airport} layout={layout} aircraft={aircraft} />
          </Suspense>
        )}
      </div>

      <Link
        to={`/airports-library/${airport.id}`}
        viewTransition
        aria-label={`Open ${airport.iataCode} in the airports library`}
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
