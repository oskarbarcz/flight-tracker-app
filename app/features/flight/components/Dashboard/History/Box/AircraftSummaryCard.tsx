import React from "react";
import { FaPlane } from "react-icons/fa6";
import { AircraftImage } from "~/features/aircraft/components/Aircraft/AircraftImage";
import { formatWeightCategory } from "~/features/airframe/lib/formatAirframe";
import type { Flight } from "~/features/flight";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type Props = {
  flight: Flight;
};

export function AircraftSummaryCard({ flight }: Props) {
  const { airframe } = flight.aircraft;

  return (
    <Container>
      <ContainerTitle icon={FaPlane} title="Aircraft" />

      <div>
        <h3 className="font-mono text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {flight.aircraft.registration}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-bold">{airframe.type}</span> · <span className="italic">{airframe.name}</span>
        </p>
      </div>

      <AircraftImage type={airframe.type} name={airframe.name} className="h-36 rounded-xl object-center" />

      <div className="flex flex-col">
        <Row label="SELCAL code" value={flight.aircraft.selcal} />
        <Row label="Livery" value={flight.aircraft.livery} />
        <Row
          label="Performance class & code"
          value={
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 font-mono text-sm font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
              {`${formatWeightCategory(airframe.weightCategory)} · ${airframe.performanceCode}`}
            </span>
          }
        />
      </div>
    </Container>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-gray-100 py-2.5 first:border-t-0 dark:border-gray-800">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
      <span className="font-mono text-sm font-bold text-gray-800 dark:text-gray-100">{value}</span>
    </div>
  );
}
