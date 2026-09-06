import L, { type LatLngTuple } from "leaflet";
import { useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import type { Airport } from "~/features/airport";
import { AirportHaloLabel } from "~/features/flight/components/Map/Element/AirportHaloLabel";
import {
  AIRPORT_STRUCTURE_ZOOM_THRESHOLD,
  RUNWAY_ZOOM_THRESHOLD,
} from "~/features/flight/components/Map/Element/zoomThresholds";
import { shiftPoint, WORLD_COPIES } from "~/shared/lib/worldCopies";

type MapAirportLabelProps = {
  airport: Airport;
  variant?: "primary" | "diversion";
};

function labelIcon(airport: Airport, variant: "primary" | "diversion", expanded: boolean) {
  const content = ReactDOMServer.renderToString(
    <AirportHaloLabel airport={airport} variant={variant} expanded={expanded} />,
  );

  return new L.DivIcon({
    html: content,
    className: "map-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export function MapAirportLabel({ airport, variant = "primary" }: MapAirportLabelProps) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  const expanded = zoom >= AIRPORT_STRUCTURE_ZOOM_THRESHOLD && zoom < RUNWAY_ZOOM_THRESHOLD;
  const position: LatLngTuple = [airport.location.latitude, airport.location.longitude];

  return (
    <>
      {WORLD_COPIES.map((offset) => (
        <Marker
          key={offset}
          position={shiftPoint(position, offset)}
          icon={labelIcon(airport, variant, expanded)}
          zIndexOffset={variant === "diversion" ? 1100 : 1000}
        />
      ))}
    </>
  );
}
