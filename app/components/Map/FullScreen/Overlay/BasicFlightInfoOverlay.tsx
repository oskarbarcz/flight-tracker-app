import { FilledScheduleWithoutTypes, Flight, FlightStatus } from "~/models";
import Container from "~/components/Layout/Container";
import { FaPlane } from "react-icons/fa";
import translateStatus from "~/models/translate/flight.translate";

type BasicFlightInfoOverlayProps = {
  flight: Flight;
};

function calculateBlockTime(offBlockTime: Date, onBlockTime: Date) {
  const diff = Math.abs(onBlockTime.getTime() - offBlockTime.getTime());
  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m`;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function BasicFlightInfoOverlay({
  flight,
}: BasicFlightInfoOverlayProps) {
  const timesheet = flight.timesheet;

  const scheduledBlockTime = calculateBlockTime(
    new Date(timesheet.scheduled.offBlockTime),
    new Date(timesheet.scheduled.onBlockTime),
  );

  let estimatedBlockTime = null;

  if (
    flight.status !== FlightStatus.Created &&
    flight.status !== FlightStatus.Ready
  ) {
    const schedule = timesheet.estimated as FilledScheduleWithoutTypes;
    estimatedBlockTime = calculateBlockTime(
      new Date(schedule.offBlockTime),
      new Date(schedule.onBlockTime),
    );
  }

  return (
    <Container className="shadow-xs">
      <div className="mb-4">
        <h2 className="block pb-2 text-3xl font-bold text-indigo-500 md:text-4xl">
          {flight.flightNumber}
        </h2>
      </div>

      <div className="flex items-center justify-between my-4">
        <div className="text-start font-bold">
          <span className="block text-4xl">
            {flight.departureAirport.iataCode}
          </span>
          <span className="block">{flight.departureAirport.city}</span>
        </div>
        <div>
          <FaPlane className="mx-auto mb-2 block" size={20} />
          {estimatedBlockTime && (
            <span className="block text-center text-green-500">
              {estimatedBlockTime}
            </span>
          )}
          <span className="block text-center text-xs">
            {scheduledBlockTime}
          </span>
        </div>
        <div className="text-end font-bold">
          <span className="block text-4xl">
            {flight.destinationAirport.iataCode}
          </span>
          <span className="block">{flight.destinationAirport.city}</span>
        </div>
      </div>

      <div className="my-4 flex items-center justify-between">
        <div className="text-start">
          {timesheet.estimated && (
            <>
              <span className="block text-xs text-green-500">{"On time"}</span>
              <span className="block text-2xl font-bold text-green-500">
                {formatTime(new Date(timesheet.estimated.offBlockTime))}
              </span>
            </>
          )}
          <span className="block text-sm">
            {"Sched. "}
            {formatTime(new Date(timesheet.scheduled.offBlockTime))}
          </span>
        </div>

        <div className="text-end">
          {timesheet.estimated && (
            <>
              <span className="block text-xs text-green-500">{"On time"}</span>
              <span className="block text-2xl font-bold text-green-500">
                {formatTime(new Date(timesheet.estimated.onBlockTime))}
              </span>
            </>
          )}
          <span className="block text-sm">
            {"Sched. "}
            {formatTime(new Date(timesheet.scheduled.onBlockTime))}
          </span>
        </div>
      </div>

      <div className="mt-8 text-indigo-500 text-center text-lg p-1 uppercase font-bold">
        {translateStatus(flight.status)}
      </div>
    </Container>
  );
}
