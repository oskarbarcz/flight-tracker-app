"use client";

import { Schedule } from "~/models/timesheet.model";
import Block from "~/components/Block";
import AdvancedDateTimePreview from "~/components/AdvancedTimePreview";

interface FlightTimesheetProps {
  scheduled: Schedule;
}

export default function TrackedFlightTimesheet({
  scheduled,
}: FlightTimesheetProps) {
  return (
    <Block>
      <div className="flex items-center justify-between gap-4">
        <section className="w-1/3">
          {scheduled.offBlockTime && (
            <AdvancedDateTimePreview
              plannedTime={scheduled.offBlockTime + "z"}
              plannedDay={String(scheduled.offBlockTime)}
              description="Scheduled off-block time"
            />
          )}
          {scheduled.takeoffTime && (
            <AdvancedDateTimePreview
              plannedTime={scheduled.takeoffTime + "z"}
              plannedDay={String(scheduled.takeoffTime)}
              description="Scheduled takeoff time"
            />
          )}
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
