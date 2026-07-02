import type { FlightPathElement } from "~/models";
import { formatDegrees } from "~/shared/lib/geo";

type Props = {
  point: FlightPathElement | undefined;
};

function formatAltitude(altitude: number | undefined): string {
  if (altitude === undefined) return "—";
  return `${Math.round(altitude).toLocaleString("en-US")} ft`;
}

function formatGroundSpeed(groundSpeed: number | undefined): string {
  if (groundSpeed === undefined) return "—";
  return `${Math.round(groundSpeed)} kt`;
}

function formatTrack(track: number | undefined): string {
  if (track === undefined) return "—";
  return formatDegrees(track);
}

function formatVerticalRate(verticalRate: number | undefined): string {
  if (verticalRate === undefined) return "—";
  const rounded = Math.round(verticalRate);
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toLocaleString("en-US")} fpm`;
}

export function LiveTelemetryOverlay({ point }: Props) {
  if (!point) return null;

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none z-10">
      <dl className="grid grid-cols-4 gap-3 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-900">
        <Stat label="ALT" value={formatAltitude(point.altitude)} />
        <Stat label="GS" value={formatGroundSpeed(point.groundSpeed)} />
        <Stat label="TRK" value={formatTrack(point.track)} />
        <Stat label="V/S" value={formatVerticalRate(point.verticalRate)} />
      </dl>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[4.5rem] text-center">
      <dt className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-gray-800 dark:text-gray-100">{value}</dd>
    </div>
  );
}
