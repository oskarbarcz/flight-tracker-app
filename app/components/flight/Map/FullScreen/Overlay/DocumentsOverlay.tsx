import { useState } from "react";
import { FaBox, FaGasPump, FaScaleBalanced, FaUserGroup, FaUserTie } from "react-icons/fa6";
import { HiInformationCircle, HiX } from "react-icons/hi";
import type { Flight, Loadsheet } from "~/models";

type Props = {
  flight: Flight;
  onClose: () => void;
};

type Variant = "preliminary" | "final";

export function DocumentsOverlay({ flight, onClose }: Props) {
  const hasPreliminary = flight.loadsheets.preliminary !== null;
  const hasFinal = flight.loadsheets.final !== null;
  const defaultVariant: Variant = hasFinal ? "final" : "preliminary";
  const [variant, setVariant] = useState<Variant>(defaultVariant);

  const loadsheet = variant === "final" ? flight.loadsheets.final : flight.loadsheets.preliminary;
  const hasAny = hasPreliminary || hasFinal;

  return (
    <section className="bg-gray-100 pointer-events-auto dark:bg-gray-950 text-gray-800 dark:text-gray-300 p-6 w-full sm:w-sm rounded-xl">
      <header className="mb-4 flex items-start justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Loadsheet</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close loadsheet"
          className="cursor-pointer p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <HiX size={20} />
        </button>
      </header>

      {hasAny && (
        <div className="mb-4 inline-flex rounded-lg bg-gray-200 p-0.5 dark:bg-gray-900">
          <VariantTab
            label="Preliminary"
            active={variant === "preliminary"}
            disabled={!hasPreliminary}
            onClick={() => setVariant("preliminary")}
          />
          <VariantTab
            label="Final"
            active={variant === "final"}
            disabled={!hasFinal}
            onClick={() => setVariant("final")}
          />
        </div>
      )}

      {!loadsheet ? (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-3 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          <HiInformationCircle className="size-5 shrink-0 text-gray-400" />
          <span>{hasAny ? `No ${variant} loadsheet has been issued yet.` : "No loadsheet has been issued yet."}</span>
        </div>
      ) : (
        <LoadsheetBody loadsheet={loadsheet} />
      )}
    </section>
  );
}

function VariantTab({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer rounded-md px-3 py-1 text-[11px] font-bold uppercase tracking-widest transition ${
        active
          ? "bg-white text-indigo-600 shadow-sm dark:bg-gray-800 dark:text-indigo-300"
          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      } disabled:cursor-not-allowed disabled:text-gray-300 dark:disabled:text-gray-600`}
    >
      {label}
    </button>
  );
}

function LoadsheetBody({ loadsheet }: { loadsheet: Loadsheet }) {
  const souls =
    loadsheet.flightCrew.pilots +
    loadsheet.flightCrew.reliefPilots +
    loadsheet.flightCrew.cabinCrew +
    loadsheet.passengers;

  return (
    <>
      <div className="mb-4 flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-bold text-gray-900 dark:text-white">{souls}</span>
        <span className="text-xs text-gray-500">souls on board</span>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        <Row icon={<FaUserTie />} label="Pilots" value={loadsheet.flightCrew.pilots} />
        <Row icon={<FaUserGroup />} label="Cabin crew" value={loadsheet.flightCrew.cabinCrew} />
        <Row icon={<FaUserTie />} label="Relief pilots" value={loadsheet.flightCrew.reliefPilots} muted />
        <Row icon={<FaUserGroup />} label="Passengers" value={loadsheet.passengers} emphasis />
      </div>

      <div className="my-4 border-t border-dashed border-gray-200 dark:border-gray-800" />

      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        <Row icon={<FaScaleBalanced />} label="Zero-fuel" value={loadsheet.zeroFuelWeight} unit="t" />
        <Row icon={<FaBox />} label="Cargo" value={loadsheet.cargo} unit="t" />
        <Row icon={<FaScaleBalanced />} label="Payload" value={loadsheet.payload} unit="t" />
        <Row icon={<FaGasPump />} label="Block fuel" value={loadsheet.blockFuel} unit="t" emphasis />
      </div>
    </>
  );
}

function Row({
  icon,
  label,
  value,
  unit,
  muted,
  emphasis,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit?: string;
  muted?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`shrink-0 text-sm ${muted ? "text-gray-300" : "text-indigo-400"}`}>{icon}</span>
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
              ? "text-xl text-gray-900 dark:text-white"
              : muted
                ? "text-base text-gray-400"
                : "text-lg text-gray-800 dark:text-gray-100"
          }`}
        >
          {value}
          {unit && <span className="ms-0.5 text-xs font-normal opacity-70">{unit}</span>}
        </div>
      </div>
    </div>
  );
}
