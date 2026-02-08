import { Button, TableCell, TableRow } from "flowbite-react";
import React, { useCallback } from "react";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { useSearchParams } from "react-router";
import FlightListElementDetails from "~/components/flight/Table/FlightListElementDetails";
import TrackingStatus from "~/components/flight/Table/TrackingStatus";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { Flight, FlightStatus } from "~/models";
import translateStatus from "~/models/translate/flight.translate";

type Props = {
  flight: Flight;
  onUpdateTimesheet: (flight: Flight) => void;
  onUpdateLoadsheet: (flight: Flight) => void;
  onRemoveFlight: (flight: Flight) => void;
  onReleaseFlight: (flight: Flight) => void;
};

export default function FlightListElement({
  flight,
  onUpdateTimesheet,
  onUpdateLoadsheet,
  onRemoveFlight,
  onReleaseFlight,
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const expandedId = searchParams.get("id");
  const isExpanded = expandedId === flight.id;

  const setUrlId = useCallback(
    (id: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (id) {
            next.set("id", id);
          } else {
            next.delete("id");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const toggleExpand = useCallback(() => {
    setUrlId(isExpanded ? null : flight.id);
  }, [flight.id, setUrlId, isExpanded]);

  return (
    <>
      <TableRow
        key={flight.id}
        className={`cursor-pointer ${isExpanded ? "border-b-gray-200" : ""}`}
        onClick={toggleExpand}
      >
        <TableCell className="text-base text-gray-900 font-bold font-mono dark:text-white">
          {flight.flightNumberWithoutSpaces}
        </TableCell>
        <TableCell>
          <div className="flex gap-1 items-center">
            {flight.departureAirport.iataCode}
            <FaArrowRight size="12" className="text-gray-800 dark:text-white" />
            {flight.destinationAirport.iataCode}
          </div>
        </TableCell>
        <TableCell>
          {flight.timesheet.scheduled.offBlockTime && (
            <>
              <FormattedIcaoDate
                date={flight.timesheet.scheduled.takeoffTime}
              />
              {" • "}
              <FormattedIcaoTime
                date={flight.timesheet.scheduled.takeoffTime}
              />
            </>
          )}
          <span className="block text-xs text-gray-500">Click for details</span>
        </TableCell>
        <TableCell>
          <div className="mb-1 text-sm">{flight.aircraft.fullName}</div>
          <div className="flex gap-2">
            <span className="flex min-w-16 justify-center rounded-md border border-gray-500 px-2 py-0.5 text-xs">
              {flight.aircraft.registration}
            </span>
            <span className="flex min-w-16 justify-center border border-gray-500 px-2 py-0.5 text-xs">
              {flight.aircraft.selcal}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div>{flight.operator.shortName}</div>
          {flight.operator.icaoCode}
        </TableCell>
        <TableCell>
          <TrackingStatus tracking={flight.tracking} />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2 text-gray-500">
            {flight.status === FlightStatus.Created && (
              <>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateTimesheet(flight);
                  }}
                  color="gray"
                  outline
                  size="xs"
                  className="flex cursor-pointer items-center"
                >
                  Edit
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFlight(flight);
                  }}
                  color="red"
                  size="xs"
                  className="flex cursor-pointer items-center"
                >
                  Remove
                </Button>
                {flight.loadsheets.preliminary && (
                  <Button
                    color="indigo"
                    outline
                    onClick={(e) => {
                      e.stopPropagation();
                      onReleaseFlight(flight);
                    }}
                    size="xs"
                    className="cursor-pointer"
                  >
                    Release for pilot
                  </Button>
                )}
              </>
            )}
            {flight.status === FlightStatus.Ready && (
              <div className="font-bold flex items-center gap-1 text-green-500">
                <FaCheckCircle className="inline" />
                Pilot can check-in
              </div>
            )}

            {flight.status !== FlightStatus.Created &&
              flight.status !== FlightStatus.Ready && (
                <span className="font-bold text-indigo-500">
                  {translateStatus(flight.status)}
                </span>
              )}
          </div>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <FlightListElementDetails
          flight={flight}
          onUpdateTimesheet={onUpdateTimesheet}
          onUpdateLoadsheet={onUpdateLoadsheet}
        />
      )}
    </>
  );
}
