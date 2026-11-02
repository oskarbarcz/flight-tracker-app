import React, { type ComponentProps, Suspense } from "react";
import type { FlightGlobeMap } from "~/features/flight/components/Map/Box/FlightGlobeMap";

const FlightGlobeMapChunk = React.lazy(() =>
  import("~/features/flight/components/Map/Box/FlightGlobeMap").then((module) => ({
    default: module.FlightGlobeMap,
  })),
);

export function LazyFlightGlobeMap(props: ComponentProps<typeof FlightGlobeMap>) {
  return (
    <Suspense fallback={<div className="h-full w-full animate-pulse bg-gray-100 dark:bg-gray-900" />}>
      <FlightGlobeMapChunk {...props} />
    </Suspense>
  );
}
