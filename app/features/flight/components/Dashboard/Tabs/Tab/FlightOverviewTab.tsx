import React from "react";
import { AircraftBox } from "~/features/flight/components/Dashboard/Tracking/Box/AircraftBox";
import { FlightProgressBox } from "~/features/flight/components/Dashboard/Tracking/Box/FlightProgressBox";
import { ParkingPositionRunwayBox } from "~/features/flight/components/Dashboard/Tracking/Box/ParkingPositionRunwayBox";
import { TimeManagementBox } from "~/features/flight/components/Dashboard/Tracking/Box/TimeManagementBox";

export function FlightOverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
      <div className="contents lg:flex lg:flex-col lg:gap-4 xl:contents">
        <FlightProgressBox />
        <ParkingPositionRunwayBox />
      </div>
      <div className="flex flex-col gap-4">
        <TimeManagementBox />
        <AircraftBox />
      </div>
    </div>
  );
}
