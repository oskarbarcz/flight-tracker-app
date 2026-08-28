import L from "leaflet";
import { Fragment, useMemo, useState } from "react";
import { Marker, Polygon, Polyline, useMap, useMapEvents } from "react-leaflet";
import {
  RUNWAY_DESIGNATOR_ZOOM_THRESHOLD,
  RUNWAY_MARKINGS_ZOOM_THRESHOLD,
} from "~/features/flight/components/Map/Element/zoomThresholds";
import type { Runway } from "~/features/runway";
import { computeRunwayPlate, uprightRotation } from "~/features/runway/lib/runwayMarkings";
import { computeRunwayRibbons } from "~/features/runway/lib/runwayPairs";
import { escapeHtml } from "~/shared/lib/escapeHtml";
import { metersToDashArray } from "~/shared/lib/mapScale";

type Props = {
  runways: Runway[];
  selectedRunwayId?: string | null;
};

const CENTERLINE_STRIPE_M = 30;
const CENTERLINE_GAP_M = 20;

function designatorIcon(designator: string, active: boolean, rotation: number) {
  const plateClass = `map-runway-plate${active ? " map-runway-plate--active" : ""}`;
  return new L.DivIcon({
    html: `<div class="map-runway-anchor"><span class="${plateClass}" style="transform: rotate(${rotation}deg)">${escapeHtml(designator)}</span></div>`,
    className: "map-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export function RunwayLines({ runways, selectedRunwayId }: Props) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  const plates = useMemo(
    () => computeRunwayRibbons(runways).map((ribbon) => ({ ribbon, plate: computeRunwayPlate(ribbon) })),
    [runways],
  );

  const showMarkings = zoom >= RUNWAY_MARKINGS_ZOOM_THRESHOLD;
  const showEveryDesignator = zoom >= RUNWAY_DESIGNATOR_ZOOM_THRESHOLD;

  return (
    <>
      {plates.map(({ ribbon, plate }) => {
        const active = ribbon.ends.some((end) => end.id === selectedRunwayId);
        const latitude = ribbon.centerline[0][0];
        const rotation = uprightRotation(ribbon.centerline[0], ribbon.centerline[1]);

        return (
          <Fragment key={ribbon.key}>
            <Polygon
              positions={ribbon.polygon}
              pathOptions={{ className: "rw-casing", fill: false, interactive: false }}
            />
            <Polygon
              positions={ribbon.polygon}
              pathOptions={{
                className: active ? "rw-surface rw-surface--active" : "rw-surface",
                stroke: false,
                interactive: false,
              }}
            />

            {showMarkings && plate.paintedCenterline && (
              <Polyline
                positions={plate.paintedCenterline}
                pathOptions={{
                  className: "rw-centerline",
                  fill: false,
                  interactive: false,
                  dashArray: metersToDashArray(latitude, zoom, CENTERLINE_STRIPE_M, CENTERLINE_GAP_M),
                }}
              />
            )}

            {showMarkings && plate.markings.length > 0 && (
              <Polygon
                positions={plate.markings}
                pathOptions={{ className: "rw-marking", stroke: false, interactive: false }}
              />
            )}

            {plate.thresholds.map((threshold) =>
              showEveryDesignator || active ? (
                <Marker
                  key={threshold.id}
                  position={threshold.designatorPosition}
                  icon={designatorIcon(threshold.designator, threshold.id === selectedRunwayId, rotation)}
                />
              ) : null,
            )}
          </Fragment>
        );
      })}
    </>
  );
}
