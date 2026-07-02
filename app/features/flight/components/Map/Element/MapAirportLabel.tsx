import L, { type LatLngExpression } from "leaflet";
import ReactDOMServer from "react-dom/server";
import { Marker } from "react-leaflet";
import { AirportExtendedLabel } from "~/features/flight/components/Map/Element/AirportExtendedLabel";
import { AirportShortLabel } from "~/features/flight/components/Map/Element/AirportShortLabel";
import type { Airport } from "~/models";

type MapAirportLabelProps = {
  airport: Airport;
  extended?: boolean;
  variant?: "primary" | "diversion";
};

const shortLabel = (airport: Airport, variant: "primary" | "diversion") => {
  const content = ReactDOMServer.renderToString(<AirportShortLabel airport={airport} variant={variant} />);

  return new L.DivIcon({
    html: content,
    iconSize: [0, 0],
    iconAnchor: [-10, 0],
  });
};

const extendedLabel = (airport: Airport, variant: "primary" | "diversion") => {
  const content = ReactDOMServer.renderToString(<AirportExtendedLabel airport={airport} variant={variant} />);

  return new L.DivIcon({
    html: content,
    className: "custom-airport-marker",
    iconSize: [300, 300],
    iconAnchor: [-15, 30],
  });
};

export function MapAirportLabel({ airport, extended = false, variant = "primary" }: MapAirportLabelProps) {
  const position: LatLngExpression = [airport.location.latitude, airport.location.longitude];

  const label = extended ? extendedLabel(airport, variant) : shortLabel(airport, variant);

  return <Marker position={position} icon={label} zIndexOffset={variant === "diversion" ? 1100 : 1000} />;
}
