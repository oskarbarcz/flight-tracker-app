import React from "react";
import { AirportTile } from "~/features/airport/components/Library/AirportTile";
import { useCurrentFlight } from "~/features/flight/hooks/useCurrentFlight";

export function CurrentFlightAirportTiles() {
  const { currentFlight, loading } = useCurrentFlight();

  if (loading) {
    return (
      <section className="space-y-3">
        <SectionHeading />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TileSkeleton />
          <TileSkeleton />
        </div>
      </section>
    );
  }

  if (!currentFlight) {
    return null;
  }

  return (
    <section className="space-y-3">
      <SectionHeading />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentFlight.orderedAirports.map((airport) => (
          <AirportTile key={airport.id} airport={airport} type={airport.type} />
        ))}
      </div>
    </section>
  );
}

function SectionHeading() {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Current flight</h2>
  );
}

function TileSkeleton() {
  return (
    <div className="h-[72px] animate-pulse rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900" />
  );
}
