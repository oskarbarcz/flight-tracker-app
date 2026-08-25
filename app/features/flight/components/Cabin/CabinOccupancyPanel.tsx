import React, { useMemo } from "react";
import { FaChair, FaTriangleExclamation } from "react-icons/fa6";
import { SeatMap } from "~/features/cabin-layout/components/SeatMap/SeatMap";
import type { CabinSeatMap } from "~/features/cabin-layout/model";
import { occupancyMode } from "~/features/flight/components/Cabin/occupancyMode";
import { NoticePanel } from "~/features/flight/components/Dashboard/Tracking/Progress/NoticePanel";
import { type LayoutMismatch, passengersOffDrawing } from "~/features/flight/lib/manifest";
import type { FlightManifest } from "~/features/flight/model";
import { DataField } from "~/shared/ui/Display/DataField";

type Props = {
  manifest: FlightManifest;
  seatMap: CabinSeatMap | null;
  mismatch: LayoutMismatch | null;
  redrawnRevision: number | null;
};

export function CabinOccupancyPanel({ manifest, seatMap, mismatch, redrawnRevision }: Props) {
  const mode = useMemo(() => occupancyMode(manifest.passengers), [manifest.passengers]);
  const offDrawing = seatMap === null ? 0 : passengersOffDrawing(manifest.passengers, seatMap);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
        <DataField label="Cabin layout" value={manifest.cabinLayout} mono />
        <DataField label="Seated against" value={`Revision ${manifest.cabinLayoutRevision}`} />
        <DataField label="Cabin seats" value={seatMap === null ? "—" : String(seatMap.totalSeats)} mono />
        <DataField label="Aircraft" value={seatMap?.aircraftTypeDisplayed ?? "—"} />
      </div>

      {mismatch !== null && (
        <NoticePanel
          tone="warning"
          icon={FaTriangleExclamation}
          title="Layout does not match this aircraft"
          description={`The cabin is drawn for ${mismatch.drawnFor}, while this leg flies ${mismatch.flying}. Seat numbers match the manifest, but the drawing may not match the cabin you are working in.`}
        />
      )}

      {redrawnRevision !== null && (
        <NoticePanel
          tone="neutral"
          icon={FaChair}
          title="The cabin has been redrawn since this flight was seated"
          description={`The catalogue now holds revision ${redrawnRevision} of ${manifest.cabinLayout}, while this flight was seated against revision ${manifest.cabinLayoutRevision}. The seats the manifest names need not exist in the cabin as it is drawn now, so the drawing is withheld. The passenger manifest below is complete.`}
        />
      )}

      {redrawnRevision === null && seatMap === null && (
        <p className="rounded-lg bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          The cabin drawing for <span className="font-mono">{manifest.cabinLayout}</span> could not be retrieved. The
          manifest below is complete.
        </p>
      )}

      {seatMap !== null && (
        <>
          <SeatMap seatMap={seatMap} mode={mode} diagramOnly />

          {offDrawing > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {offDrawing === 1
                ? "One seated passenger holds a seat the drawing does not carry, and appears in the manifest only."
                : `${offDrawing} seated passengers hold seats the drawing does not carry, and appear in the manifest only.`}
            </p>
          )}
        </>
      )}
    </div>
  );
}
