import React from "react";
import type { IconType } from "react-icons";
import { FaBox, FaFileInvoice, FaGasPump, FaScaleBalanced, FaUserGroup, FaUserTie } from "react-icons/fa6";
import { HiInformationCircle } from "react-icons/hi";
import { Container } from "~/components/shared/Layout/Container";
import { ContainerTitle } from "~/components/shared/Layout/ContainerTitle";
import type { Loadsheet } from "~/models";

type Props = {
  preliminary: Loadsheet | null;
  final: Loadsheet | null;
};

export function LoadsheetSummaryCard({ preliminary, final }: Props) {
  const loadsheet = final ?? preliminary ?? null;
  const isPreliminary = !final && Boolean(preliminary);

  if (!loadsheet) {
    return (
      <Container padding="spacious" className="h-full">
        <ContainerTitle icon={FaFileInvoice} title="Loadsheet" />
        <div className="flex flex-1 items-center gap-3 rounded-lg border border-dashed border-gray-300 px-4 py-5 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          <HiInformationCircle className="size-5 shrink-0 text-gray-400" />
          <span>No loadsheet was recorded for this flight.</span>
        </div>
      </Container>
    );
  }

  const souls =
    loadsheet.flightCrew.pilots +
    loadsheet.flightCrew.reliefPilots +
    loadsheet.flightCrew.cabinCrew +
    loadsheet.passengers;

  return (
    <Container padding="spacious" className="h-full">
      <ContainerTitle
        icon={FaFileInvoice}
        title="Loadsheet"
        actions={
          isPreliminary ? (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400">
              Preliminary
            </span>
          ) : undefined
        }
      />
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-bold text-gray-900 dark:text-white">{souls}</span>
        <span className="text-xs text-gray-500">souls on board</span>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        <Row icon={FaUserTie} label="Pilots" value={loadsheet.flightCrew.pilots} />
        <Row icon={FaUserGroup} label="Cabin crew" value={loadsheet.flightCrew.cabinCrew} />
        <Row icon={FaUserTie} label="Relief pilots" value={loadsheet.flightCrew.reliefPilots} muted />
        <Row icon={FaUserGroup} label="Passengers" value={loadsheet.passengers} emphasis />
      </div>

      <div className="border-t border-dashed border-gray-200 dark:border-gray-800" />

      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        <Row icon={FaScaleBalanced} label="Zero-fuel" value={loadsheet.zeroFuelWeight} unit="t" />
        <Row icon={FaBox} label="Cargo" value={loadsheet.cargo} unit="t" />
        <Row icon={FaScaleBalanced} label="Payload" value={loadsheet.payload} unit="t" />
        <Row icon={FaGasPump} label="Block fuel" value={loadsheet.blockFuel} unit="t" emphasis />
      </div>
    </Container>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  unit,
  muted,
  emphasis,
}: {
  icon: IconType;
  label: string;
  value: number;
  unit?: string;
  muted?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className={`shrink-0 ${muted ? "text-gray-300" : "text-indigo-400"}`} size={14} />
      <div className="min-w-0 flex-1">
        <div
          className={`text-[10px] font-bold uppercase tracking-widest ${
            muted ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {label}
        </div>
        <div
          className={`font-mono font-bold ${
            emphasis
              ? "text-2xl text-gray-900 dark:text-white"
              : muted
                ? "text-lg text-gray-400"
                : "text-xl text-gray-800 dark:text-gray-100"
          }`}
        >
          {value}
          {unit && <span className="ms-0.5 text-sm font-normal opacity-70">{unit}</span>}
        </div>
      </div>
    </div>
  );
}
