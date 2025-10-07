"use client";

import { Marker } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { Position } from "~/models/common/geo";
import MapAirportLabelContent from "~/components/Map/Element/MapAirportLabelContent";

type MapAirportLabelProps = {
  position: Position;
  label: string;
};

const createAirportLabelIcon = (label: string) => {
  const content = ReactDOMServer.renderToString(<MapAirportLabelContent label={label} />);

  return new L.DivIcon({
    html: content,
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
