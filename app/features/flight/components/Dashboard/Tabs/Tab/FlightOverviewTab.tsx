import React from "react";
import { AircraftBox } from "~/features/flight/components/Dashboard/Tracking/Box/AircraftBox";
import { ParkingPositionRunwayBox } from "~/features/flight/components/Dashboard/Tracking/Box/ParkingPositionRunwayBox";
import { TimeManagementBox } from "~/features/flight/components/Dashboard/Tracking/Box/TimeManagementBox";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { FlightDataTab } from "~/features/flight/lib/flightDataTabs";
import { TrackingView, trackFlightPath } from "~/features/flight/lib/trackingView";
import { FiledRouteCard } from "~/features/route/components/FiledRouteCard";

export function FlightOverviewTab() {
  const { flight } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <FiledRouteCard
        flight={flight}
        briefingHref={trackFlightPath(flight.id, TrackingView.Briefing, FlightDataTab.Route)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
        <ParkingPositionRunwayBox />
        <TimeManagementBox />
        <AircraftBox />
      </div>
    </div>
  );
}
