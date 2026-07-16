import L from "leaflet";
import { Marker } from "react-leaflet";
import type { Gate } from "~/features/gate";
import { escapeHtml } from "~/shared/lib/escapeHtml";

type Props = {
  gates: Gate[];
};

function gateChipIcon(name: string) {
  return new L.DivIcon({
    html: `<span class="map-gate-chip"><span class="map-gate-chip__dot"></span>${escapeHtml(name)}</span>`,
    className: "map-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export function GateMarkers({ gates }: Props) {
  return (
    <>
      {gates.map((gate) => {
        if (!gate.coordinates) return null;
        return (
          <Marker
            key={gate.id}
            position={[gate.coordinates.latitude, gate.coordinates.longitude]}
            icon={gateChipIcon(gate.name)}
          />
        );
      })}
    </>
  );
}
