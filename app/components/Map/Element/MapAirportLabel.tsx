import { Marker } from "react-leaflet";
import L, { LatLngExpression, LatLngTuple } from "leaflet";

type MapAirportLabelProps = {
  position: Position;
  label: string;
};

type Position = LatLngTuple | LatLngExpression;

const createAirportLabelIcon = (label: string) => {
  return new L.DivIcon({
    html: `<span style="background-color: rgba(46, 16, 101, 0.6); color: white; padding: 4px 8px; border-radius: 15px; font-weight: bold; font-family: sans-serif; font-size: 12px; white-space: nowrap;">${label}</span>`,
    className: "",
    iconSize: [0, 0],
    iconAnchor: [-10, 0],
  });
};

export default function MapAirportLabel({
  position,
  label,
}: MapAirportLabelProps) {
  return <Marker position={position} icon={createAirportLabelIcon(label)} />;
}
