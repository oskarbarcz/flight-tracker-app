import L from "leaflet";
import { Fragment, useMemo, useState } from "react";
import { Marker, Polyline, useMap, useMapEvents } from "react-leaflet";
import { RUNWAY_APPROACH_DETAIL_ZOOM_THRESHOLD } from "~/features/flight/components/Map/Element/zoomThresholds";
import type { Runway } from "~/features/runway";
import { computeApproachPath, computeRunwayPlate, uprightRotation } from "~/features/runway/lib/runwayMarkings";
import { computeRunwayRibbons } from "~/features/runway/lib/runwayPairs";
import { escapeHtml } from "~/shared/lib/escapeHtml";

type Props = {
  runways: Runway[];
  selectedRunwayId: string | null;
};

const APPROACH_DISTANCE_NM = 10;

function approachLabelIcon(text: string, rotation: number) {
  return new L.DivIcon({
    html: `<div class="map-runway-anchor"><span class="map-approach-label" style="transform: rotate(${rotation}deg)">${escapeHtml(text)}</span></div>`,
    className: "map-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export function RunwayApproach({ runways, selectedRunwayId }: Props) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  const approaches = useMemo(() => {
    if (!selectedRunwayId) return [];

    const ribbon = computeRunwayRibbons(runways).find((candidate) =>
      candidate.ends.some((end) => end.id === selectedRunwayId),
    );
    if (!ribbon) return [];

    const rotation = uprightRotation(ribbon.centerline[0], ribbon.centerline[1]);
    return computeRunwayPlate(ribbon).thresholds.map((threshold) => ({
      ...computeApproachPath(threshold, APPROACH_DISTANCE_NM),
      rotation,
    }));
  }, [runways, selectedRunwayId]);

  const showDetail = zoom >= RUNWAY_APPROACH_DETAIL_ZOOM_THRESHOLD;

  return (
    <>
      {approaches.map((approach) => (
        <Fragment key={approach.key}>
          <Polyline
            positions={approach.centerline}
            pathOptions={{ className: "rw-approach", fill: false, interactive: false }}
          />
          {showDetail && (
            <Polyline
              positions={approach.ticks}
              pathOptions={{ className: "rw-approach-tick", fill: false, interactive: false }}
            />
          )}
          {showDetail &&
            approach.labels.map((label) => (
              <Marker
                key={label.key}
                position={label.position}
                icon={approachLabelIcon(label.text, approach.rotation)}
              />
            ))}
        </Fragment>
      ))}
    </>
  );
}
