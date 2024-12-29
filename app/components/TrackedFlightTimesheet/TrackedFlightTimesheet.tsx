"use client";

import { Timesheet } from "~/models/timesheet.model";
import Block from "~/components/Block/Block";
import AdvancedDateTimePreview from "~/components/AdvancedTimePreview/AdvancedTimePreview";

interface FlightTimesheetProps {
  scheduled: Timesheet;
}

export default function TrackedFlightTimesheet({
  scheduled,
}: FlightTimesheetProps) {
  return (
    <Block>
      <div className="flex justify-between items-center gap-4">
        <section className="w-1/3">
          <AdvancedDateTimePreview
            plannedTime={scheduled.offBlockTime.getTime() + "z"}
            plannedDay={String(scheduled.offBlockTime.getDay())}
            description="Scheduled off-block time"
          />
          <AdvancedDateTimePreview
            plannedTime={scheduled.takeoffTime.getTime() + "z"}
            plannedDay={String(scheduled.takeoffTime.getDay())}
            description="Scheduled takeoff time"
          />
        </section>

        <section className="w-1/3">
          {/*<AdvancedDateTimePreview*/}
          {/*  plannedTime={scheduled.blockTime}*/}
          {/*  description="Block time"*/}
          {/*/>*/}
          {/*<AdvancedDateTimePreview*/}
          {/*  plannedTime={scheduled.airTime}*/}
          {/*  description="Air time"*/}
          {/*/>*/}
        </section>

        <section className="w-1/3">
          {/*<AdvancedDateTimePreview*/}
          {/*  plannedTime={hourFormatter.format(scheduled.onBlockTime) + "z"}*/}
          {/*  plannedDay={dayFormatter.format(scheduled.onBlockTime)}*/}
          {/*  description="Scheduled arrival time"*/}
          {/*/>*/}
          {/*<AdvancedDateTimePreview*/}
          {/*  plannedTime={hourFormatter.format(scheduled.arrivalTime) + "z"}*/}
          {/*  plannedDay={dayFormatter.format(scheduled.arrivalTime)}*/}
          {/*  description="Scheduled on-block time"*/}
          {/*/>*/}
        </section>
      </div>
    </Block>
  );
}
