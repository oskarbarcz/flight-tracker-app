import React from "react";
import type { Aircraft } from "~/features/aircraft";
import { AircraftProfile } from "~/features/aircraft/components/Aircraft/AircraftProfile";
import { AircraftSpecStrip } from "~/features/aircraft/components/AircraftDetails/AircraftSpecStrip";

type Props = {
  aircraft: Aircraft;
};

export function AircraftDetailsHeader({ aircraft }: Props) {
  const { airframe } = aircraft;

  return (
    <header className="relative">
      <div className="relative flex flex-col gap-2 border-b border-gray-200 pb-5 dark:border-gray-700 lg:min-h-[17.5rem] lg:flex-row lg:items-end lg:gap-6">
        <AircraftProfile
          type={airframe.type}
          name={airframe.name}
          className="pointer-events-none order-last -mx-2 select-none [mask-image:linear-gradient(to_right,black_84%,transparent)] lg:absolute lg:bottom-2 lg:right-0 lg:mx-0 lg:w-[62%] lg:max-w-[720px]"
        />

        <div className="relative min-w-0 lg:max-w-[38%]">
          <h1 className="font-mono text-4xl font-black tracking-tighter text-gray-900 dark:text-white xl:text-5xl">
            {aircraft.registration}
          </h1>
          <p className="mt-1 text-base font-semibold text-gray-500 dark:text-gray-400">{airframe.name}</p>
        </div>
      </div>

      <AircraftSpecStrip aircraft={aircraft} className="pt-4" />
    </header>
  );
}
