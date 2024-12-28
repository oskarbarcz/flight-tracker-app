"use client";

import { Aircraft } from "~/models";
import React from "react";
import Block from "~/components/Block/Block";

interface TrackedFlightAircraftDetailsProps {
  aircraft: Aircraft;
}

export default function TrackedFlightAircraftDetails({
  aircraft,
}: TrackedFlightAircraftDetailsProps) {
  return (
    <Block>
      <div className="flex justify-between items-center gap-4">
        <article className="w-1/3 text-center">
          <div className="text-5xl font-bold mt-1 mb-2">
            {aircraft.icaoCode}
          </div>
          <div className="text-md text-gray-500">Aircraft</div>
        </article>

        <article className="w-1/3 text-center">
          <div>
            <div className="text-3xl font-bold mt-4">
              {aircraft.registration}
            </div>
            <div className="text-md text-gray-500">Airframe</div>
          </div>
          <div>
            <div className="text-lg font-bold mt-4">{aircraft.selcal}</div>
            <div className="text-md text-gray-500">SELCAL code</div>
          </div>
        </article>

        <article className="w-1/3 text-center">
          <div>
            {/*<div className="text-3xl font-bold mt-4">{operator.shortName}</div>*/}
            <div className="text-md text-gray-500">Operator</div>
          </div>
          <div>
            <div className="text-lg font-bold mt-4">{aircraft.livery}</div>
            <div className="text-md text-gray-500">Livery</div>
          </div>
        </article>
      </div>
    </Block>
  );
}
