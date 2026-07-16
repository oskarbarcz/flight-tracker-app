import L from "leaflet";
import { Marker } from "react-leaflet";
import type { ParkingPosition } from "~/features/parking-position";
import { escapeHtml } from "~/shared/lib/escapeHtml";

type Props = {
  parkingPositions: ParkingPosition[];
  assignedParkingPositionId?: string | null;
};

function parkingIcon(name: string, filled: boolean, assigned: boolean) {
  const dotClass = `map-parking__dot ${filled ? "map-parking__dot--filled" : "map-parking__dot--hollow"}`;
  const labelClass = `map-parking__label${assigned ? " map-parking__label--assigned" : ""}`;
  return new L.DivIcon({
    html: `<span class="map-parking"><span class="${dotClass}"></span><span class="${labelClass}">${escapeHtml(name)}</span></span>`,
    className: "map-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export function ParkingPositionMarkers({ parkingPositions, assignedParkingPositionId }: Props) {
  return (
    <>
      {parkingPositions.map((parkingPosition) => {
        if (!parkingPosition.coordinates) return null;
        const assigned = Boolean(assignedParkingPositionId) && parkingPosition.id === assignedParkingPositionId;
        const filled = !assignedParkingPositionId || assigned;
        return (
          <Marker
            key={parkingPosition.id}
            position={[parkingPosition.coordinates.latitude, parkingPosition.coordinates.longitude]}
            icon={parkingIcon(parkingPosition.name, filled, assigned)}
          />
        );
      })}
    </>
  );
}
