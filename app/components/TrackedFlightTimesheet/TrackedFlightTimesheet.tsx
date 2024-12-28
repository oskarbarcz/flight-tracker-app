"use client";

import { Timesheet } from "~/models/timesheet.model";
import Block from "~/components/Block/Block";

interface FlightTimesheetProps {
  scheduled: Timesheet;
}

export default function TrackedFlightTimesheet({
  scheduled,
}: FlightTimesheetProps) {
  const hourFormatter = new Intl.DateTimeFormat("pl-pl", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dayFormatter = new Intl.DateTimeFormat("pl-pl", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Block>
      <div className="flex justify-between items-center gap-4">
        <section className="w-1/3">
          {/*<AdvancedDateTimePreview*/}
          {/*  plannedTime={hourFormatter.format(scheduled.offBlockTime) + "z"}*/}
          {/*  plannedDay={dayFormatter.format(scheduled.offBlockTime)}*/}
          {/*  description="Scheduled off-block time"*/}
          {/*/>*/}
          {/*<AdvancedDateTimePreview*/}
          {/*  plannedTime={hourFormatter.format(scheduled.takeoffTime) + "z"}*/}
          {/*  plannedDay={dayFormatter.format(scheduled.takeoffTime)}*/}
          {/*  description="Scheduled takeoff time"*/}
          {/*/>*/}
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
