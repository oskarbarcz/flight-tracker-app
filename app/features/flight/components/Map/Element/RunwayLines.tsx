import L from "leaflet";
import { useMemo } from "react";
import { Marker, Polygon } from "react-leaflet";
import type { Runway } from "~/features/runway";
import { computeRunwayRibbons, type RunwayRibbon } from "~/features/runway/lib/runwayPairs";
import { escapeHtml } from "~/shared/lib/escapeHtml";
import { FLIGHT_COLOR, RUNWAY_COLOR } from "~/shared/lib/mapColors";

type Props = {
  runways: Runway[];
  selectedRunwayId?: string | null;
};

function labelRotation([start, end]: RunwayRibbon["centerline"]): number {
  const meanLatitude = (((start[0] + end[0]) / 2) * Math.PI) / 180;
  const dx = (end[1] - start[1]) * Math.cos(meanLatitude);
  const dy = -(end[0] - start[0]);
  let degrees = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (degrees > 90) degrees -= 180;
  if (degrees < -90) degrees += 180;
  return degrees;
}

function designatorIcon(designator: string, selected: boolean, rotation: number) {
  const labelClass = `map-runway-label${selected ? " map-runway-label--selected" : ""}`;
  return new L.DivIcon({
    html: `<div class="map-runway-anchor"><span class="${labelClass}" style="transform: rotate(${rotation}deg)">${escapeHtml(designator)}</span></div>`,
    className: "map-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export function RunwayLines({ runways, selectedRunwayId }: Props) {
  const ribbons = useMemo(() => computeRunwayRibbons(runways), [runways]);

  return (
    <>
      {ribbons.map((ribbon) => {
        const selected = ribbon.ends.some((end) => end.id === selectedRunwayId);
        const color = selected ? FLIGHT_COLOR : RUNWAY_COLOR;
        return (
          <Polygon
            key={ribbon.key}
            positions={ribbon.polygon}
            pathOptions={{
              color,
              weight: 0.75,
              opacity: selected ? 0.9 : 0.55,
              fillColor: color,
              fillOpacity: selected ? 0.85 : 0.45,
            }}
          />
        );
      })}
      {ribbons.flatMap((ribbon) => {
        const rotation = labelRotation(ribbon.centerline);
        return ribbon.ends.map((end) => (
          <Marker
            key={end.id}
            position={[end.coordinates.latitude, end.coordinates.longitude]}
            icon={designatorIcon(end.designator, end.id === selectedRunwayId, rotation)}
          />
        ));
      })}
    </>
  );
}
