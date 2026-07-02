import { Button } from "flowbite-react";
import React from "react";
import { HiPencil } from "react-icons/hi";
import { LuPlane, LuTag } from "react-icons/lu";
import { Link } from "react-router";
import type { Aircraft } from "~/features/aircraft";
import { AircraftImage } from "~/features/aircraft/components/Aircraft/AircraftImage";
import { formatCruiseSpeed, formatServiceCeiling, formatWeightCategory } from "~/features/airframe/lib/formatAirframe";
import { DataField } from "~/shared/ui/Display/DataField";
import { DataSection } from "~/shared/ui/Display/DataSection";

type Props = {
  aircraft: Aircraft;
  editUrl: string;
};

export function AircraftDetailsHeader({ aircraft, editUrl }: Props) {
  const { airframe } = aircraft;

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div className="flex flex-col gap-5 lg:col-span-1">
        <div>
          <span className="block font-mono text-4xl font-bold text-gray-900 dark:text-white">
            {aircraft.registration}
          </span>
          <span className="mt-1 block text-lg font-semibold text-gray-500 dark:text-gray-400">{airframe.name}</span>
        </div>

        <DataSection icon={LuPlane} color="indigo" title="Airframe">
          <div className="grid grid-cols-2 gap-2">
            <DataField label="Type code" value={airframe.type} mono />
            <DataField label="Cruise speed" value={formatCruiseSpeed(airframe.cruiseSpeed)} mono />
            <DataField label="Service ceiling" value={formatServiceCeiling(airframe.serviceCeiling)} mono />
            <DataField label="Weight category" value={formatWeightCategory(airframe.weightCategory)} />
          </div>
        </DataSection>

        <DataSection icon={LuTag} color="green" title="Identity">
          <div className="grid grid-cols-2 gap-2">
            <DataField label="SELCAL" value={aircraft.selcal} mono />
            <div className="col-span-2">
              <DataField label="Livery" value={aircraft.livery} />
            </div>
          </div>
        </DataSection>
      </div>

      <div className="relative flex items-center justify-center lg:col-span-2">
        <Button
          as={Link}
          to={editUrl}
          viewTransition
          size="sm"
          color="indigo"
          className="absolute right-0 top-0 space-x-1.5"
        >
          <HiPencil />
          <span>Update airframe data</span>
        </Button>
        <AircraftImage type={airframe.type} name={airframe.name} size="hero" className="max-h-80 dark:brightness-75" />
      </div>
    </div>
  );
}
