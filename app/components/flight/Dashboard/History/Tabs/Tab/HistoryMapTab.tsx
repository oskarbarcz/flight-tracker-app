import React from "react";
import { HistoryFlightMap } from "~/components/flight/Map/Box/HistoryFlightMap";
import { useHistoryFlight } from "~/state/api/context/useHistoryFlight";
import { MapSettingsProvider } from "~/state/app/context/useMapSettings";

export function HistoryMapTab() {
  const { flight, diversion } = useHistoryFlight();

  if (!flight) return null;

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="relative h-[32rem] w-full">
        <MapSettingsProvider>
          <HistoryFlightMap flight={flight} diversion={diversion} />
        </MapSettingsProvider>
      </div>
    </div>
  );
}
