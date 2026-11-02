import type { LatLngTuple } from "leaflet";
import { useMemo } from "react";
import type { Flight, FlightPathElement } from "~/features/flight";
import { aircraftGlobeMarker, airportGlobeMarkers } from "~/features/flight/components/Map/Globe/globeMarkers";
import { airportRoute } from "~/features/flight/lib/flightMapBounds";
import { directRouteOverlay, flightPathOverlay } from "~/features/flight/lib/globeTrackingOverlay";
import type { GlobeInsets } from "~/shared/lib/globeCamera";
import { mergeOverlays } from "~/shared/lib/globeStyle";
import { type GlobeCameraTarget, GlobeMap, type GlobeMarker } from "~/shared/ui/Globe/GlobeMap";

type Props = {
  flight: Flight;
  path: FlightPathElement[];
};

const NO_INSETS: GlobeInsets = { top: 0, bottom: 0 };
const MAX_FIT_ZOOM = 7;

export function CompactGlobeMap({ flight, path }: Props) {
  const { departureAirport, destinationAirport } = flight;

  const overlay = useMemo(
    () => mergeOverlays(directRouteOverlay(departureAirport, destinationAirport), flightPathOverlay(path)),
    [departureAirport, destinationAirport, path],
  );

  const target = useMemo((): GlobeCameraTarget => {
    const lastPoint = path.at(-1);

    return {
      key: "route",
      kind: "fit",
      maxZoom: MAX_FIT_ZOOM,
      points: [
        ...airportRoute(departureAirport, destinationAirport),
        ...(lastPoint === undefined ? [] : [[lastPoint.latitude, lastPoint.longitude] satisfies LatLngTuple]),
      ],
    };
  }, [departureAirport, destinationAirport, path]);

  const markers = useMemo(() => {
    const aircraft = aircraftGlobeMarker(path);

    return [
      ...airportGlobeMarkers(departureAirport),
      ...airportGlobeMarkers(destinationAirport),
      ...(aircraft === null ? [] : [aircraft]),
    ] satisfies GlobeMarker[];
  }, [departureAirport, destinationAirport, path]);

  return <GlobeMap overlay={overlay} target={target} insets={NO_INSETS} markers={markers} interactive={false} />;
}
