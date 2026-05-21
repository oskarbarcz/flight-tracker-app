"use client";

import React from "react";
import { FaPlane } from "react-icons/fa6";
import { GiCommercialAirplane } from "react-icons/gi";
import { Container } from "~/components/shared/Layout/Container";
import { ContainerTitle } from "~/components/shared/Layout/ContainerTitle";
import {
  formatCruiseSpeed,
  formatPerformanceCode,
  formatServiceCeiling,
  formatWeightCategory,
} from "~/functions/formatAirframe";
import type { Flight } from "~/models";

type Props = {
  flight: Flight;
};

export function AircraftSummaryCard({ flight }: Props) {
  const { airframe } = flight.aircraft;

  return (
    <Container className="relative">
      <GiCommercialAirplane
        aria-hidden
        className="absolute -right-6 top-2 size-40 rotate-[18deg] text-gray-100 dark:text-gray-800"
      />

      <ContainerTitle icon={FaPlane} title="Aircraft" />

      <div className="relative">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{flight.aircraft.registration}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{airframe.name}</p>
      </div>

      <div className="relative grid grid-cols-2 gap-3">
        <Stamp label="Airframe" value={airframe.type} />
        <Stamp label="SELCAL" value={flight.aircraft.selcal} />
        <Stamp label="Cruise speed" value={formatCruiseSpeed(airframe.cruiseSpeed)} />
        <Stamp label="Service ceiling" value={formatServiceCeiling(airframe.serviceCeiling)} />
        <Stamp label="Livery" value={flight.aircraft.livery} />
        <Stamp
          label="Performance class & code"
          value={`${formatWeightCategory(airframe.weightCategory)} · ${formatPerformanceCode(airframe.performanceCode)}`}
        />
      </div>
    </Container>
  );
}

function Stamp({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={`relative rounded-xl bg-gray-50 px-3 py-3 dark:bg-gray-950 ${className ?? ""}`}>
      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</div>
      <div className="mt-0.5 font-mono text-base font-bold text-gray-800 dark:text-gray-100">{value}</div>
    </div>
  );
}
