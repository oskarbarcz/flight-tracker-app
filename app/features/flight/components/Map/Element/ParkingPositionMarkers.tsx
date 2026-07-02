import L from "leaflet";
import { Marker, Tooltip } from "react-leaflet";
import { GateLocation, type ParkingPosition } from "~/models";
import { PIN_COLOR, TERMINAL_COLOR } from "~/shared/lib/mapColors";

type Props = {
  parkingPositions: ParkingPosition[];
};

function pinIcon(color: string) {
  return new L.DivIcon({
    html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="22px" height="22px">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
    </svg>
  `,
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 22],
  });
}

const remoteIcon = pinIcon(PIN_COLOR);
const gateIcon = pinIcon(TERMINAL_COLOR);

export function ParkingPositionMarkers({ parkingPositions }: Props) {
  return (
    <>
      {parkingPositions.map((parkingPosition) => {
        if (!parkingPosition.coordinates) return null;
        const isGate = parkingPosition.location === GateLocation.Gate;
        return (
          <Marker
            key={parkingPosition.id}
            position={[parkingPosition.coordinates.latitude, parkingPosition.coordinates.longitude]}
            icon={isGate ? gateIcon : remoteIcon}
          >
            <Tooltip permanent direction="top" offset={[0, -18]} className={isGate ? "terminal-label" : "gate-label"}>
              {parkingPosition.name}
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}
