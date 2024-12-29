"use client";

import { Button, Progress } from "flowbite-react";
import Block from "~/components/Block/Block";

interface TrackedFlightStatusProps {
  callsign: string;
  flightNumber: string;
}

export default function TrackedFlightStatus({
  callsign,
  flightNumber,
}: TrackedFlightStatusProps) {
  return (
    <Block>
      <div className="flex items-center justify-between gap-4">
        <article className="w-1/6 text-center">
          <div>
            <div className="mt-2 text-3xl font-bold">{flightNumber}</div>
            <div className="text-gray-500">Flight number</div>
          </div>
          <div>
            <div className="mt-2 text-3xl font-bold">{callsign}</div>
            <div className="text-gray-500">Callsign</div>
          </div>
        </article>

        <article className="w-2/3 text-center">
          <div className="flex flex-col gap-2">
            <Progress progress={45} color="dark" size="lg" />
            <div className="mx-auto mt-2 w-fit text-gray-500">
              <div className="mb-2 rounded-lg border border-gray-500 px-2 py-1 uppercase">
                Preparation
              </div>
              <span className="pt-3">3h 40m remaining</span>
            </div>
          </div>
        </article>

        <article className="w-1/6 text-center">
          <Button className="m-auto" disabled>
            Check-in
          </Button>
          <p className="mt-2 text-xs text-gray-500">
            This&nbsp;action&nbsp;is&nbsp;available
            60&nbsp;minutes&nbsp;before&nbsp;boarding.
          </p>
        </article>
      </div>
    </Block>
  );
}
