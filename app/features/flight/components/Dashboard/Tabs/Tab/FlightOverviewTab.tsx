import React from "react";
import { AircraftBox } from "~/features/flight/components/Dashboard/Tracking/Box/AircraftBox";
import { FlightProgressBox } from "~/features/flight/components/Dashboard/Tracking/Box/FlightProgressBox";
import { ParkingPositionRunwayBox } from "~/features/flight/components/Dashboard/Tracking/Box/ParkingPositionRunwayBox";
import { TimeManagementBox } from "~/features/flight/components/Dashboard/Tracking/Box/TimeManagementBox";

export function FlightOverviewTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
      <FlightProgressBox />
      <ParkingPositionRunwayBox />
      <div className="flex flex-col gap-4">
        <TimeManagementBox />
        <AircraftBox />
      </div>
    </div>
  );
}
