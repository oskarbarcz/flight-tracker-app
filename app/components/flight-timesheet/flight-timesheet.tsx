import {Timesheet} from "~/model/times";

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

  return <section className="mt-10 flex justify-between items-center gap-4">
    <article className="w-1/3">
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold">
          {hourFormatter.format(scheduled.offBlockTime)}z
        </div>
        <div className="text-lg font-bold">
          {dayFormatter.format(scheduled.offBlockTime)}
        </div>
        <div className="text-gray-500">Scheduled off-block time</div>
      </div>
      <div className="flex flex-col items-center mt-5">
        <div className="text-3xl font-bold">
          {hourFormatter.format(scheduled.takeoffTime)}z
        </div>
        <div className="text-lg font-bold">
          {dayFormatter.format(scheduled.takeoffTime)}
        </div>
        <div className="text-gray-500">Scheduled takeoff time</div>
      </div>
    </article>

    <div className="w-1/3">
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold">
          {hourFormatter.format(scheduled.offBlockTime)}
        </div>
        <div className="text-gray-500">Block time</div>
      </div>
      <div className="flex flex-col items-center mt-5">
        <div className="text-3xl font-bold">
          {hourFormatter.format(scheduled.offBlockTime)}
        </div>
        <div className="text-gray-500">Air time</div>
      </div>
    </div>

    <article className="w-1/3">
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold">
          {hourFormatter.format(scheduled.landingTime)}z
        </div>
        <div className="text-lg font-bold">
          {dayFormatter.format(scheduled.landingTime)}
        </div>
        <div className="text-gray-500">Scheduled landing time</div>
      </div>
      <div className="flex flex-col items-center mt-5">
        <div className="text-3xl font-bold">
          {hourFormatter.format(scheduled.onBlockTime)}z
        </div>
        <div className="text-lg font-bold">
          {dayFormatter.format(scheduled.onBlockTime)}
        </div>
        <div className="text-gray-500">Scheduled on-block time</div>
      </div>
    </article>
  </section>;
}