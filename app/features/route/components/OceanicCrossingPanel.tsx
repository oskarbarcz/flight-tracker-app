import { Badge } from "flowbite-react";
import React from "react";
import { translateOceanicDirection, translateOceanicRouting } from "~/features/route/i18n";
import { ABSENT, formatFlightLevels } from "~/features/route/lib/routeFigures";
import { type OceanicCrossing, OceanicDirection, OceanicRouting, type OceanicTrack } from "~/features/route/model";
import { formatDate } from "~/shared/lib/time";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { MetaRow } from "~/shared/ui/Display/MetaRow";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  crossing: OceanicCrossing;
};

const ROUTING_COLOR: Record<OceanicRouting, string> = {
  [OceanicRouting.Track]: "info",
  [OceanicRouting.TrackGeometry]: "warning",
  [OceanicRouting.Random]: "gray",
};

function formatValidity(from: string | null, to: string | null): string {
  if (from === null || to === null) {
    return ABSENT;
  }

  return `${formatDate(new Date(from))} — ${formatDate(new Date(to))}`;
}

function TrackDetail({ track }: { track: OceanicTrack }) {
  return (
    <div className="flex flex-col gap-2">
      <MetaRow label="Track" value={<span className="font-mono">{track.identifier}</span>} />
      <MetaRow label="Direction" value={translateOceanicDirection(track.direction)} />
      <MetaRow label="Message" value={<span className="font-mono">TMI {track.tmi}</span>} />
      <MetaRow label="Issuing OCA" value={<span className="font-mono">{track.issuingOca ?? ABSENT}</span>} />
      <MetaRow label="Levels" value={<span className="font-mono">{formatFlightLevels(track.levels)}</span>} />
      <MetaRow
        label="Valid"
        value={<span className="font-mono">{formatValidity(track.validFrom, track.validTo)}</span>}
      />
      {track.route !== null && (
        <div className="mt-1 border-t border-gray-200 pt-2 dark:border-gray-800">
          <FieldLabel>Track route</FieldLabel>
          <p className="mt-1 break-words font-mono text-sm text-gray-800 dark:text-gray-100">{track.route}</p>
        </div>
      )}
    </div>
  );
}

function TrackMessage({ tracks, flownIdentifier }: { tracks: OceanicTrack[]; flownIdentifier: string | null }) {
  return (
    <div className="mt-1 border-t border-gray-200 pt-3 dark:border-gray-800">
      <FieldLabel>Track message ({tracks.length} published)</FieldLabel>
      <table className="mt-2 w-full text-left">
        <thead>
          <tr className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <th scope="col" className="pb-1 pe-3">
              Id
            </th>
            <th scope="col" className="pb-1 pe-3">
              Dir
            </th>
            <th scope="col" className="pb-1">
              Levels
            </th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track) => (
            <tr
              key={`${track.identifier}-${track.direction}`}
              className={
                track.identifier === flownIdentifier
                  ? "bg-indigo-50 font-bold dark:bg-indigo-500/10"
                  : "text-gray-600 dark:text-gray-300"
              }
            >
              <td className="py-0.5 pe-3 font-mono text-sm">{track.identifier}</td>
              <td className="py-0.5 pe-3 font-mono text-sm">{track.direction === OceanicDirection.East ? "E" : "W"}</td>
              <td className="py-0.5 font-mono text-sm tabular-nums">{formatFlightLevels(track.levels)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function OceanicCrossingPanel({ crossing }: Props) {
  const flown = crossing.tracks.find((track) => track.identifier === crossing.trackId) ?? null;

  return (
    <Container header={<CardHeader title="Oceanic crossing" />} padding="spacious">
      <div className="flex flex-wrap items-center gap-2">
        <Badge color={ROUTING_COLOR[crossing.routing]}>{translateOceanicRouting(crossing.routing)}</Badge>
        {crossing.direction !== null && <Badge color="gray">{translateOceanicDirection(crossing.direction)}</Badge>}
      </div>

      {flown !== null && <TrackDetail track={flown} />}

      {flown === null && crossing.routing !== OceanicRouting.Random && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          The plan names track {crossing.trackId ?? ABSENT}, which the published message does not carry.
        </p>
      )}

      {crossing.tracks.length > 0 && <TrackMessage tracks={crossing.tracks} flownIdentifier={crossing.trackId} />}
    </Container>
  );
}
