"use client";

import { Schedule } from "~/models";
import React from "react";

export const SimpleTimeComponent = ({ timesheet }: { timesheet: Schedule }) => {
  return (
    <div>
      <p>
        <strong>off-block: </strong>
        {timesheet.offBlockTime && <span>{timesheet.offBlockTime}</span>}
      </p>
      <p>
        <strong>takeoff: </strong>
        {timesheet.takeoffTime && <span>{timesheet.takeoffTime}</span>}
      </p>
      <p>
        <strong>arrival: </strong>
        {timesheet.arrivalTime && <span>{timesheet.arrivalTime}</span>}
      </p>
      <p>
        <strong>on-block: </strong>
        {timesheet.onBlockTime && <span>{timesheet.onBlockTime}</span>}
      </p>
    </div>
  );
};
