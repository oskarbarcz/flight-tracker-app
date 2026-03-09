"use client";

import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { FlightStatus } from "~/models";
import { useAdsbData } from "~/state/api/context/useAdsbData";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

export function MapPreviewStatusOverlay() {
  const { flight } = useTrackedFlight();
  const { flightPath } = useAdsbData();

  const [isFlightTracked, setIsFlightTracked] = useState(false);

  useEffect(() => {
    if (!flight) return;

    setIsFlightTracked(flightPath.length > 0);
  }, [flight, flightPath]);

  if (!flight) return;

  const isFlightTrackable = [FlightStatus.TaxiingOut, FlightStatus.InCruise, FlightStatus.TaxiingIn].includes(
    flight.status,
  );

  if (isFlightTrackable && !isFlightTracked) {
    return (
      <div className="absolute top-3 left-3 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-500 w-fit flex rounded-lg px-3 py-2">
        <span className="text-xs flex items-center gap-2">
          <FaExclamationTriangle />
          No ADSB data available. Check your transponder.
        </span>
      </div>
    );
  }

  if (isFlightTrackable && isFlightTracked) {
    return (
      <div className="absolute top-3 left-3 bg-gray-100 w-fit flex items-center gap-2 rounded-lg px-3 py-1.5 dark:bg-gray-900">
        <span className="bg-red-600 h-3 rounded-full w-3 inline-block"></span>
        <span className="uppercase font-bold text-xs animate-pulse">Live</span>
      </div>
    );
  }

  return (
    <div className="absolute top-3 left-3 bg-white w-fit flex rounded-lg px-3 py-2 dark:bg-gray-900">
      <span className="font-bold text-xs">Flight preview</span>
    </div>
  );
}
