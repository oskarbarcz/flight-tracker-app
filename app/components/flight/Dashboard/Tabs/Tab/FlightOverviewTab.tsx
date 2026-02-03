import React from "react";
import AircraftBox from "~/components/flight/Dashboard/Tracking/Box/AircraftBox";
import FlightLogBox from "~/components/flight/Dashboard/Tracking/Box/FlightLogBox";
import FlightProgressBox from "~/components/flight/Dashboard/Tracking/Box/FlightProgressBox";
import FlightScheduleBox from "~/components/flight/Dashboard/Tracking/Box/FlightScheduleBox";
import TimeManagementBox from "~/components/flight/Dashboard/Tracking/Box/TimeManagementBox";

export default function FlightOverviewTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FlightProgressBox />
      <FlightScheduleBox />
      <TimeManagementBox />
      <AircraftBox />
      <FlightLogBox className="md:row-span-2 md:row-start-1 md:col-start-3" />
    </div>
  );
}
