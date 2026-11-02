import L, { type LatLngTuple } from "leaflet";
import React from "react";
import { MapContainer } from "react-leaflet";
import type { Flight } from "~/features/flight";
import { MapAirportLabel } from "~/features/flight/components/Map/Element/MapAirportLabel";
import { MapResizeHandler } from "~/features/flight/components/Map/Element/MapResizeHandler";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { MapViewMemory } from "~/features/flight/components/Map/Element/MapViewMemory";
import { MapWheelZoom } from "~/features/flight/components/Map/Element/MapWheelZoom";
import { MapWorldConstraint } from "~/features/flight/components/Map/Element/MapWorldConstraint";
import { flightMapPositions } from "~/features/flight/lib/flightMapBounds";
import { PlannedRouteLayer } from "~/features/route/components/Chart/RouteOverlay";
import type { RouteBriefingState } from "~/features/route/hooks/useRouteBriefing";
import type { EtopsBriefing } from "~/features/route/model";
import { greatCirclePath } from "~/shared/lib/greatCircle";
import type { MapCameraView } from "~/shared/lib/mapCameraView";
import { alignLongitude } from "~/shared/lib/worldCopies";

type Props = {
  flight: Flight;
  briefing: EtopsBriefing;
  state: RouteBriefingState;
  initialView: MapCameraView | null;
  onViewChange: (view: MapCameraView) => void;
};

const CHART_TOP_BAR_HEIGHT = 41;

function chartBounds(flight: Flight, briefing: EtopsBriefing): L.LatLngBounds {
  const { departurePosition, boundsPoints } = flightMapPositions(flight, null);
  const route = greatCirclePath(briefing.route.fixes.map((fix): LatLngTuple => [fix.latitude, fix.longitude]));
  const etopsPoints = (briefing.etops?.points ?? []).map((point) =>
    alignLongitude([point.position.latitude, point.position.longitude], departurePosition[1]),
  );

  return L.latLngBounds([...boundsPoints, ...route, ...etopsPoints]);
}

export function FlatRouteMap({ flight, briefing, state, initialView, onViewChange }: Props) {
  return (
    <MapContainer
      bounds={chartBounds(flight, briefing)}
      boundsOptions={{ padding: [48, 48] }}
      scrollWheelZoom={true}
      worldCopyJump={true}
      zoomSnap={0}
      className="h-full w-full z-0"
      zoomControl={false}
      attributionControl={false}
    >
      <MapTileLayer />
      <MapWorldConstraint crossAntimeridian={true} />

      <PlannedRouteLayer state={state} />

      <MapAirportLabel airport={flight.departureAirport} />
      <MapAirportLabel airport={flight.destinationAirport} />
      <MapResizeHandler />
      <MapWheelZoom />
      <MapViewMemory initialView={initialView} onViewChange={onViewChange} topInset={CHART_TOP_BAR_HEIGHT} />
    </MapContainer>
  );
}
