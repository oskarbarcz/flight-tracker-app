import type { Route } from ".react-router/types/app/routes/pilot/airports/+types/AirportLibraryRoute";
import React from "react";
import { useLoaderData } from "react-router";
import { AirportSearchBox } from "~/features/airport/components/Library/AirportSearchBox";
import { PinnedAirportTiles } from "~/features/airport/components/Library/PinnedAirportTiles";
import { AirportService } from "~/features/airport/service";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

export async function clientLoader(_: Route.ClientLoaderArgs) {
  const airports = await new AirportService().fetchAll();
  return { airports };
}

export default function AirportLibraryRoute() {
  const { airports } = useLoaderData<typeof clientLoader>();
  usePageTitle("Airports library");

  return (
    <div className="flex w-full flex-col gap-10 pt-6 sm:pt-12">
      <div className="mx-auto w-full max-w-2xl text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Airports library</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Search any airport by name, IATA or ICAO code.</p>
        <div className="mt-5 text-left">
          <AirportSearchBox airports={airports} />
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Custom pins</h2>
        <PinnedAirportTiles />
      </section>
    </div>
  );
}
