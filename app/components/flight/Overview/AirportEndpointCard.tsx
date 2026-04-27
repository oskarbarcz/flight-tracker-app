"use client";

import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa6";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { Container } from "~/components/shared/Layout/Container";
import type { Airport, FilledSchedule } from "~/models";

type Props = {
  airport: Airport;
  kind: "departure" | "arrival";
  schedule: FilledSchedule;
  details?: React.ReactNode;
  actions?: React.ReactNode;
};

export function AirportEndpointCard({ airport, kind, schedule, details, actions }: Props) {
  const isDeparture = kind === "departure";
  const label = isDeparture ? "Departure" : "Arrival";
  const Icon = isDeparture ? FaPlaneDeparture : FaPlaneArrival;

  const date = isDeparture ? schedule.offBlockTime : schedule.onBlockTime;
  const gateTime = isDeparture ? schedule.offBlockTime : schedule.onBlockTime;
  const runwayTime = isDeparture ? schedule.takeoffTime : schedule.arrivalTime;
  const gateLabel = isDeparture ? "OFF" : "IN";
  const runwayLabel = isDeparture ? "OUT" : "ON";

  const taxiMinutes = Math.round(Math.abs(runwayTime.getTime() - gateTime.getTime()) / 60_000);

  const [leftBlock, rightBlock] = isDeparture
    ? [
        { label: gateLabel, time: gateTime, primary: false },
        { label: runwayLabel, time: runwayTime, primary: true },
      ]
    : [
        { label: runwayLabel, time: runwayTime, primary: true },
        { label: gateLabel, time: gateTime, primary: false },
      ];

  return (
    <Container padding="none" className="overflow-hidden">
      <div className="h-1 bg-linear-to-r from-indigo-500 via-indigo-400 to-indigo-300 dark:from-indigo-600 dark:via-indigo-500 dark:to-indigo-400" />
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-indigo-500">
            <Icon size={14} />
            <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
          </div>
          <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 font-mono text-xs font-bold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
            <FormattedIcaoDate date={date} />
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0 sm:flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                {airport.iataCode}
              </span>
              <span className="font-mono text-xs text-gray-400 dark:text-gray-500">{airport.icaoCode}</span>
            </div>
            <div className="mt-1 truncate text-sm font-medium text-gray-800 dark:text-gray-100">{airport.name}</div>
            <div className="truncate text-xs text-gray-500 dark:text-gray-400">
              {airport.city}, {airport.country}
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr_auto] items-stretch gap-3 sm:shrink-0">
            <TimeBlock label={leftBlock.label} time={leftBlock.time} primary={leftBlock.primary} />
            <TaxiSeparator minutes={taxiMinutes} />
            <TimeBlock label={rightBlock.label} time={rightBlock.time} primary={rightBlock.primary} />
          </div>
        </div>

        {details && <div className="mt-4 space-y-3">{details}</div>}

        {actions && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-200 dark:border-gray-800 pt-3">{actions}</div>
        )}
      </div>
    </Container>
  );
}

function TimeBlock({ label, time, primary }: { label: string; time: Date; primary: boolean }) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 text-center min-w-22 ${
        primary
          ? "border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950"
          : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
      }`}
    >
      <span
        className={`block text-[10px] font-bold uppercase tracking-wider ${
          primary ? "text-indigo-500" : "text-gray-500"
        }`}
      >
        {label}
      </span>
      <span
        className={`mt-0.5 block font-mono text-base font-bold ${
          primary ? "text-indigo-700 dark:text-indigo-300" : "text-gray-800 dark:text-gray-100"
        }`}
      >
        <FormattedIcaoTime date={time} />
      </span>
    </div>
  );
}

function TaxiSeparator({ minutes }: { minutes: number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        Taxi · <span className="font-mono text-gray-600 dark:text-gray-300">{minutes}m</span>
      </span>
      <div className="relative h-px w-full bg-linear-to-r from-gray-300 to-indigo-400 dark:from-gray-700 dark:to-indigo-500">
        <FaArrowRight
          className="absolute right-0 top-1/2 -translate-y-1/2 text-indigo-400 dark:text-indigo-500"
          size={10}
        />
      </div>
    </div>
  );
}
