import type { ReactNode } from "react";
import { FaArrowRight } from "react-icons/fa";
import type { Flight } from "~/features/flight";
import { formatAirportClockTime } from "~/features/flight/lib/flightProgress";

type Props = {
  flight: Flight;
};

function totalFlightHours(minutes: number): string {
  return `${Math.floor(minutes / 60).toLocaleString("en-US")} h`;
}

function DetailBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Endpoint({ label, time, code, align }: { label: string; time: string; code: string; align: "start" | "end" }) {
  return (
    <div className={align === "end" ? "text-right" : ""}>
      <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">{label}</div>
      <div className={`mt-1 flex items-baseline gap-1.5 ${align === "end" ? "justify-end" : ""}`}>
        <span className="font-mono text-lg font-bold tabular-nums text-gray-900 dark:text-white">{time}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{code} local</span>
      </div>
    </div>
  );
}

export function FlightDetailsDrawer({ flight }: Props) {
  const { aircraft, operator, pilot } = flight;
  const loadsheet = flight.loadsheets.final ?? flight.loadsheets.preliminary;
  const souls = loadsheet
    ? loadsheet.flightCrew.pilots +
      loadsheet.flightCrew.reliefPilots +
      loadsheet.flightCrew.cabinCrew +
      loadsheet.passengers
    : null;

  const departure = flight.timesheet.estimated?.offBlockTime ?? flight.timesheet.scheduled.offBlockTime;
  const arrival = flight.timesheet.estimated?.onBlockTime ?? flight.timesheet.scheduled.onBlockTime;
  const scheduleIsEstimated = Boolean(flight.timesheet.estimated);

  return (
    <div className="flex max-h-[50vh] flex-col gap-5 overflow-y-auto border-t border-gray-100 pt-4 dark:border-gray-800">
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        <DetailBlock label="Operated by">
          <div className="font-semibold text-gray-900 dark:text-white">{operator.fullName}</div>
          <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
            {operator.iataCode} · {operator.callsign}
          </div>
        </DetailBlock>

        <DetailBlock label="Aircraft">
          <div className="font-semibold text-gray-900 dark:text-white">{aircraft.airframe.name}</div>
          <div className="font-mono text-xs text-gray-500 dark:text-gray-400">{aircraft.registration}</div>
        </DetailBlock>

        <DetailBlock label="Pilot in command">
          {pilot ? (
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{pilot.name}</div>
                <div className="font-mono text-xs text-gray-500 dark:text-gray-400">{pilot.pilotLicenseId}</div>
              </div>
              <div className="whitespace-nowrap font-mono text-sm font-semibold tabular-nums text-gray-700 dark:text-gray-200">
                {totalFlightHours(pilot.totalFlightTime)}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">Not assigned</div>
          )}
        </DetailBlock>

        <DetailBlock label="On board">
          {loadsheet && souls !== null ? (
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-lg font-bold tabular-nums text-gray-900 dark:text-white">{souls}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                souls · {loadsheet.passengers} passengers
              </span>
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">Not available yet</div>
          )}
        </DetailBlock>
      </div>

      <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
        <div className="flex items-center justify-between gap-4">
          <Endpoint
            label="Departure"
            time={formatAirportClockTime(departure, flight.departureAirport.timezone)}
            code={flight.departureAirport.iataCode}
            align="start"
          />
          <FaArrowRight className="size-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
          <Endpoint
            label="Arrival"
            time={formatAirportClockTime(arrival, flight.destinationAirport.timezone)}
            code={flight.destinationAirport.iataCode}
            align="end"
          />
        </div>
        <div className="mt-2 text-[11px] text-gray-400 dark:text-gray-500">
          {scheduleIsEstimated ? "Estimated times" : "Scheduled times"}
        </div>
      </div>
    </div>
  );
}
