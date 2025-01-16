"use client";

import Block from "~/components/Block";

interface TrackedFlightDetailsProps {
  callsign: string;
  flightNumber: string;
}

export default function TrackedFlightDetails({
  callsign,
  flightNumber,
}: TrackedFlightDetailsProps) {
  return (
    <Block>
      <div className="flex items-center justify-between gap-4">
        <article className="w-1/3 text-center">
          <div className="mb-2 mt-1 text-5xl font-bold">{callsign}</div>
          <div className="pt-1 text-gray-500">Callsign</div>
        </article>

        <article className="w-1/3 text-center">
          <div className="mb-2 mt-1 text-5xl font-bold">{flightNumber}</div>
          <div className="pt-1 text-gray-500">Flight number</div>
        </article>
      </div>
    </Block>
  );
}
