import React from "react";
import { AircraftBox } from "~/components/flight/Dashboard/Tracking/Box/AircraftBox";
import { FlightProgressBox } from "~/components/flight/Dashboard/Tracking/Box/FlightProgressBox";
import { GateRunwayBox } from "~/components/flight/Dashboard/Tracking/Box/GateRunwayBox";
import { TimeManagementBox } from "~/components/flight/Dashboard/Tracking/Box/TimeManagementBox";

export function FlightOverviewTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
      <FlightProgressBox />
      <GateRunwayBox />
      <div className="flex flex-col gap-4">
        <TimeManagementBox />
        <AircraftBox />
      </div>
    </div>
  );
}
