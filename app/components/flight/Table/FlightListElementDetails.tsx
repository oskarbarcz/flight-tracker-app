import { Alert, Button, TableCell, TableRow } from "flowbite-react";
import React from "react";
import { HiInformationCircle } from "react-icons/hi";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { Flight, FlightStatus } from "~/models";

type Props = {
  flight: Flight;
  onUpdateTimesheet: (flight: Flight) => void;
  onUpdateLoadsheet: (flight: Flight) => void;
};

export default function FlightListElementDetails({
  flight,
  onUpdateTimesheet,
  onUpdateLoadsheet,
}: Props) {
  return (
    <TableRow className="inset-shadow-sm bg-gray-50 dark:bg-gray-900">
      <TableCell colSpan={7}>
        <div className="flex gap-4">
          <div className="shrink-0">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold dark:text-white">
                Scheduled timesheet
              </h3>
              {flight.status === FlightStatus.Created && (
                <Button
                  onClick={() => onUpdateTimesheet(flight)}
                  color="gray"
                  outline
                  size="xs"
                  className="ms-12 flex cursor-pointer items-center"
                >
                  Update
                </Button>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-6">
              <div className="shrink-0 text-center">
                <span className="mb-1 block text-xs">DEP DATE</span>
                <span className="block font-bold text-gray-900 dark:text-white">
                  <FormattedIcaoDate
                    date={flight.timesheet.scheduled.offBlockTime}
                  />
                </span>
              </div>
              <div className="shrink-0 text-center">
                <span className="mb-1 block text-xs">OFF</span>
                <span className="block font-bold text-gray-900 dark:text-white">
                  <FormattedIcaoTime
                    date={flight.timesheet.scheduled.offBlockTime}
                  />
                </span>
              </div>
              <div className="shrink-0 text-center">
                <span className="mb-1 block text-xs">OUT</span>
                <span className="block font-bold text-gray-900 dark:text-white">
                  <FormattedIcaoTime
                    date={flight.timesheet.scheduled.takeoffTime}
                  />
                </span>
              </div>
              <div className="shrink-0 text-center">
                <span className="mb-1 block text-xs">IN</span>
                <span className="block font-bold text-gray-900 dark:text-white">
                  <FormattedIcaoTime
                    date={flight.timesheet.scheduled.arrivalTime}
                  />
                </span>
              </div>
              <div className="shrink-0 text-center">
                <span className="mb-1 block text-xs">ON</span>
                <span className="block font-bold text-gray-900 dark:text-white">
                  <FormattedIcaoTime
                    date={flight.timesheet.scheduled.onBlockTime}
                  />
                </span>
              </div>
            </div>
          </div>
          <span className="border-e mx-3 border-gray-300 dark:border-gray-600"></span>
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold dark:text-white">
                Preliminary loadsheet
              </h3>
              {flight.status === FlightStatus.Created && (
                <Button
                  onClick={() => onUpdateLoadsheet(flight)}
                  color="gray"
                  outline
                  size="xs"
                  className="ms-3 flex cursor-pointer items-center"
                >
                  Update
                </Button>
              )}
            </div>

            {flight.loadsheets.preliminary && (
              <div className="flex gap-6">
                <div className="text-center">
                  <span className="mb-1 block text-xs">Pilots</span>
                  <span className="block font-mono font-bold text-gray-900 dark:text-white">
                    {flight.loadsheets.preliminary.flightCrew.pilots}
                  </span>
                </div>
                <div className="text-center">
                  <span className="mb-1 block text-xs">Relief pilots</span>
                  <span className="block font-mono font-bold text-gray-900 dark:text-white">
                    {flight.loadsheets.preliminary.flightCrew.reliefPilots}
                  </span>
                </div>
                <div className="text-center">
                  <span className="mb-1 block text-xs">Cabin crew</span>
                  <span className="block font-mono font-bold text-gray-900 dark:text-white">
                    {flight.loadsheets.preliminary.flightCrew.cabinCrew}
                  </span>
                </div>
                <div className="text-center">
                  <span className="mb-1 block text-xs">Passengers</span>
                  <span className="block font-mono font-bold text-gray-900 dark:text-white">
                    {flight.loadsheets.preliminary.passengers}
                  </span>
                </div>
                <div className="text-center">
                  <span className="mb-1 block text-xs">Zero-fuel weight</span>
                  <span className="block font-mono font-bold text-gray-900 dark:text-white">
                    {flight.loadsheets.preliminary.zeroFuelWeight}
                    <span className="text-xs">t</span>
                  </span>
                </div>
                <div className="text-center">
                  <span className="mb-1 block text-xs">Cargo</span>
                  <span className="block font-mono font-bold text-gray-900 dark:text-white">
                    {flight.loadsheets.preliminary.cargo}
                    <span className="text-xs">t</span>
                  </span>
                </div>
                <div className="text-center">
                  <span className="mb-1 block text-xs">Payload</span>
                  <span className="block font-mono font-bold text-gray-900 dark:text-white">
                    {flight.loadsheets.preliminary.payload}
                    <span className="text-xs">t</span>
                  </span>
                </div>
                <div className="text-center">
                  <span className="mb-1 block text-xs">Block fuel</span>
                  <span className="block font-mono font-bold text-gray-900 dark:text-white">
                    {flight.loadsheets.preliminary.blockFuel}
                    <span className="text-xs">t</span>
                  </span>
                </div>
              </div>
            )}
            {!flight.loadsheets.preliminary && (
              <Alert color="warning" icon={HiInformationCircle}>
                Preliminary loadsheet is missing.
              </Alert>
            )}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
