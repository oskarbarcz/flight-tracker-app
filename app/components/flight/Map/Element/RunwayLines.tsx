import L from "leaflet";
import { useMemo } from "react";
import { Marker, Polyline } from "react-leaflet";
import { computeRunwayLines } from "~/functions/runwayPairs";
import type { Runway } from "~/models";

type Props = {
  runways: Runway[];
  selectedRunwayId?: string | null;
};

const SELECTED_COLOR = "#4338ca";
const UNSELECTED_LABEL_COLOR = "#9ca3af";
const UNSELECTED_LINE_COLOR = "#d1d5db";

function endLabelIcon(designator: string, color: string) {
  return new L.DivIcon({
    html: `<span class="rounded text-white font-mono font-bold text-xs px-1.5 py-0.5 shadow" style="background-color: ${color}">${designator}</span>`,
    className: "",
    iconSize: [0, 0],
    iconAnchor: [-4, 6],
  });
}

export function RunwayLines({ runways, selectedRunwayId }: Props) {
  const lines = useMemo(() => computeRunwayLines(runways), [runways]);

  return (
    <>
      {lines.map((line) => {
        const isSelectedPair = line.ends.some((end) => end.id === selectedRunwayId);
        const color = isSelectedPair ? SELECTED_COLOR : UNSELECTED_LINE_COLOR;
        return <Polyline key={line.key} positions={line.positions} pathOptions={{ color, weight: 6, opacity: 0.85 }} />;
      })}
      {lines.flatMap((line) =>
        line.ends.map((end) => {
          const color = end.id === selectedRunwayId ? SELECTED_COLOR : UNSELECTED_LABEL_COLOR;
          return (
            <Marker
              key={end.id}
              position={[end.coordinates.latitude, end.coordinates.longitude]}
              icon={endLabelIcon(end.designator, color)}
            />
          );
        }),
      )}
    </>
  );
}
