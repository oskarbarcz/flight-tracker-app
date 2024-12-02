import {Timesheet} from "~/model/times";
import AdvancedDateTimePreview from "~/components/advanced-time-preview/advanced-time-preview";

interface FlightTimesheetProps {
  scheduled: Timesheet
}

export default function FlightTimesheet({scheduled}: FlightTimesheetProps) {
  const hourFormatter = new Intl.DateTimeFormat('pl-pl', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const dayFormatter = new Intl.DateTimeFormat('pl-pl', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',

  });

  return <section className="border border-gray-300 shadow rounded-lg p-8 mt-5 flex justify-between items-center gap-4">
    <article className="w-1/3">
      <AdvancedDateTimePreview
        plannedTime={hourFormatter.format(scheduled.offBlockTime)+ 'z'}
        plannedDay={dayFormatter.format(scheduled.offBlockTime)}
        description="Scheduled off-block time"
      />
      <AdvancedDateTimePreview
        plannedTime={hourFormatter.format(scheduled.takeoffTime)+ 'z'}
        plannedDay={dayFormatter.format(scheduled.takeoffTime)}
        description="Scheduled takeoff time"
      />
    </article>

    <article className="w-1/3">
      <AdvancedDateTimePreview
        plannedTime={scheduled.blockTime}
        description="Block time"
      />
      <AdvancedDateTimePreview
        plannedTime={scheduled.airTime}
        description="Air time"
      />
    </article>

    <article className="w-1/3">
      <AdvancedDateTimePreview
        plannedTime={hourFormatter.format(scheduled.landingTime) + 'z'}
        plannedDay={dayFormatter.format(scheduled.landingTime)}
        description="Scheduled arrival time"
      />
      <AdvancedDateTimePreview
        plannedTime={hourFormatter.format(scheduled.landingTime) + 'z'}
        plannedDay={dayFormatter.format(scheduled.landingTime)}
        description="Scheduled on-block time"
      />
    </article>
  </section>;
}