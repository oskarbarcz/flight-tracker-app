"use client";

import { Marker } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import ReactDOMServer from "react-dom/server";
import AirportShortLabel from "~/components/flight/Map/Element/AirportShortLabel";
import { Airport } from "~/models";
import AirportExtendedLabel from "~/components/flight/Map/Element/AirportExtendedLabel";

type MapAirportLabelProps = {
  airport: Airport;
  extended?: boolean;
};

const shortLabel = (airport: Airport) => {
  const content = ReactDOMServer.renderToString(
    <AirportShortLabel airport={airport} />,
  );

  return new L.DivIcon({
    html: content,
    iconSize: [0, 0],
    iconAnchor: [-10, 0],
  });
};

const extendedLabel = (airport: Airport) => {
  const content = ReactDOMServer.renderToString(
    <AirportExtendedLabel airport={airport} />,
  );

  return new L.DivIcon({
    html: content,
    className: "custom-airport-marker",
    iconSize: [300, 300],
    iconAnchor: [-15, 30],
  });
};

export default function MapAirportLabel({
  airport,
  extended = false,
}: MapAirportLabelProps) {
  const position: LatLngExpression = [
    airport.location.latitude,
    airport.location.longitude,
  ];

  const label = extended ? extendedLabel(airport) : shortLabel(airport);

  return <Marker position={position} icon={label} />;
}
