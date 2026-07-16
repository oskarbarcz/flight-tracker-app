import type { FlightPathElement } from "~/features/flight";
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

export function LiveTelemetry({ point }: Props) {
  if (!point) return null;

  return (
    <div className="flex items-center gap-3">
      <Stat label="ALT" value={formatAltitude(point.altitude)} />
      <Stat label="GS" value={formatGroundSpeed(point.groundSpeed)} />
      <Stat label="TRK" value={formatTrack(point.track)} />
      <Stat label="V/S" value={formatVerticalRate(point.verticalRate)} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-1 whitespace-nowrap">
      <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">
        {label}
      </span>
      <span className="font-mono text-xs font-semibold tabular-nums text-gray-800 dark:text-gray-100">{value}</span>
    </span>
  );
}
