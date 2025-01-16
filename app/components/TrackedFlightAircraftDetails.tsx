"use client";

import { Aircraft } from "~/models";
import React from "react";
import Block from "~/components/Block";

interface TrackedFlightAircraftDetailsProps {
  aircraft: Aircraft;
}

export default function TrackedFlightAircraftDetails({
  aircraft,
}: TrackedFlightAircraftDetailsProps) {
  return (
    <Block>
      <div className="flex items-center justify-between gap-4">
        <article className="w-1/3 text-center">
          <div className="mb-2 mt-1 text-5xl font-bold">
            {aircraft.icaoCode}
          </div>
          <div className="text-gray-500">Aircraft</div>
        </article>

        <article className="w-1/3 text-center">
          <div>
            <div className="mt-4 text-3xl font-bold">
              {aircraft.registration}
            </div>
            <div className="text-gray-500">Airframe</div>
          </div>
          <div>
            <div className="mt-4 text-lg font-bold">{aircraft.selcal}</div>
            <div className="text-gray-500">SELCAL code</div>
          </div>
        </article>

        <article className="w-1/3 text-center">
          <div>
            {/*<div className="text-3xl font-bold mt-4">{operators.shortName}</div>*/}
            <div className="text-gray-500">Operator</div>
          </div>
          <div>
            <div className="mt-4 text-lg font-bold">{aircraft.livery}</div>
            <div className="text-gray-500">Livery</div>
          </div>
        </article>
      </div>
    </Block>
  );
}
