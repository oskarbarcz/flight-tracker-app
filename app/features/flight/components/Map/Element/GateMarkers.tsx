import L from "leaflet";
import { Marker, Tooltip } from "react-leaflet";
import type { Gate } from "~/features/gate";
import { TERMINAL_COLOR } from "~/shared/lib/mapColors";

type Props = {
  gates: Gate[];
};

const pinIcon = new L.DivIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${TERMINAL_COLOR}" width="22px" height="22px">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
    </svg>
  `,
  className: "",
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

export function GateMarkers({ gates }: Props) {
  return (
    <>
      {gates.map((gate) => {
        if (!gate.coordinates) return null;
        return (
          <Marker key={gate.id} position={[gate.coordinates.latitude, gate.coordinates.longitude]} icon={pinIcon}>
            <Tooltip permanent direction="top" offset={[0, -18]} className="terminal-label">
              {gate.name}
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}
