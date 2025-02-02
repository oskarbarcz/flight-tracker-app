"use client";

import { Flight } from "~/models";
import { PiUserSoundBold } from "react-icons/pi";

type FlightInfoHeaderProps = {
  flight: Flight;
};
export default function FlightInfoHeader({ flight }: FlightInfoHeaderProps) {
  return (
    <header className="col-span-1 md:col-span-3">
      <div className="mb-3 mt-1 flex items-center gap-3">
        <span className="text-3xl font-bold text-indigo-500 md:text-4xl">
          {flight.flightNumber}
        </span>
        <span>•</span>
        <div>
          {flight.callsign}
          <span className="flex items-center text-xs">
            <PiUserSoundBold className="me-2 inline-block" />
            {flight.operator.callsign}
          </span>
        </div>
      </div>
      <div className="my-2 flex items-center gap-2">
        {flight.aircraft.shortName}
        <span>•</span>
        <span className="inline-block rounded-md border border-gray-600 px-2 py-0.5 text-xs">
          {flight.aircraft.registration}
        </span>
        <span>•</span>
        <span className="inline-block border border-gray-600 px-2 py-0.5 text-xs">
          {flight.aircraft.selcal}
        </span>
      </div>
      <div className="my-2">
        {"Operated by "}
        <span className="font-bold">{flight.operator.shortName}</span>
      </div>
    </header>
  );
}
