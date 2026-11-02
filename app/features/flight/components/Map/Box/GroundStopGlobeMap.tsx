import { useThemeMode } from "flowbite-react";
import type { LatLngTuple } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import ReactDOMServer from "react-dom/server";
import type { Airport } from "~/features/airport";
import type { AirportLayout } from "~/features/airport/hooks/useAirportLayout";
import type { ParkedAircraft } from "~/features/flight/components/Map/Box/GroundStopMap";
import { airportLayoutGlobeMarkers } from "~/features/flight/components/Map/Globe/globeMarkers";
import { type GlobeAirportScene, globeAirportOverlay } from "~/features/flight/lib/globeAirportOverlay";
import { operatorFinUrl } from "~/features/operator/components/OperatorFin";
import type { GlobeInsets } from "~/shared/lib/globeCamera";
import { destinationPoint } from "~/shared/lib/greatCircle";
import { prefersReducedMotion } from "~/shared/lib/reducedMotion";
import { type GlobeCameraTarget, GlobeMap, type GlobeMarker } from "~/shared/ui/Globe/GlobeMap";

type Props = {
  airport: Airport;
  layout: AirportLayout;
  aircraft: ParkedAircraft | null;
};

const NO_INSETS: GlobeInsets = { top: 0, bottom: 0 };
const AIRPORT_FIT_ZOOM = 14;
const STAND_ZOOM = 14.5;
const SETTLE_DELAY_MS = 700;
const SETTLE_DURATION_MS = 2200;
const FALLBACK_RADIUS_RADIANS = 3500 / 6_371_000;
const COMPASS_POINTS = [0, 90, 180, 270];

function airportFrame(airport: Airport): LatLngTuple[] {
  if (airport.shape && airport.shape.length >= 3) {
    return airport.shape.map((point): LatLngTuple => [point.latitude, point.longitude]);
  }

  const centre: LatLngTuple = [airport.location.latitude, airport.location.longitude];
  return COMPASS_POINTS.map((bearing) => destinationPoint(centre, bearing, FALLBACK_RADIUS_RADIANS));
}

function ParkedAircraftLabel({ aircraft, standName }: { aircraft: ParkedAircraft | null; standName: string }) {
  const fin = aircraft ? operatorFinUrl(aircraft.operator.icaoCode) : undefined;

  return (
    <>
      <span className="map-parked" />
      <div className="map-aircraft-label map-aircraft-label--globe map-aircraft-label--parked">
        {fin && aircraft && (
          <img src={fin} alt={`${aircraft.operator.shortName} tail fin`} className="map-aircraft-label__fin" />
        )}
        <span className="map-aircraft-label__identity">
          <span className="map-aircraft-label__flight">{aircraft?.registration ?? `Stand ${standName}`}</span>
          {aircraft && <span className="map-aircraft-label__registration">Stand {standName}</span>}
        </span>
      </div>
    </>
  );
}

function useSettledOnStand(standPosition: LatLngTuple | null): boolean {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    setSettled(false);
    if (standPosition === null) return;

    if (prefersReducedMotion()) {
      setSettled(true);
      return;
    }

    const timer = window.setTimeout(() => setSettled(true), SETTLE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [standPosition]);

  return settled;
}

export function GroundStopGlobeMap({ airport, layout, aircraft }: Props) {
  const { computedMode } = useThemeMode();
  const coordinates = layout.stand?.coordinates ?? null;
  const standPosition = useMemo<LatLngTuple | null>(
    () => (coordinates ? [coordinates.latitude, coordinates.longitude] : null),
    [coordinates],
  );
  const settled = useSettledOnStand(standPosition);

  const scenes = useMemo(
    (): GlobeAirportScene[] => [
      {
        airport,
        runways: layout.runways,
        assignedRunwayId: null,
        terminals: layout.terminals,
        gates: [],
        parkingPositions: [],
        assignedParkingPositionId: null,
      },
    ],
    [airport, layout.runways, layout.terminals],
  );

  const overlay = useMemo(() => globeAirportOverlay(scenes, computedMode), [scenes, computedMode]);

  const target = useMemo((): GlobeCameraTarget => {
    if (settled && standPosition !== null) {
      return {
        key: `stand-${layout.stand?.id}`,
        kind: "point",
        position: standPosition,
        zoom: STAND_ZOOM,
        glideMs: SETTLE_DURATION_MS,
      };
    }

    return { key: `airport-${airport.id}`, kind: "fit", points: airportFrame(airport), maxZoom: AIRPORT_FIT_ZOOM };
  }, [airport, settled, standPosition, layout.stand?.id]);

  const markers = useMemo((): GlobeMarker[] => {
    const parked: GlobeMarker[] =
      standPosition !== null && layout.stand
        ? [
            {
              id: "parked-aircraft",
              position: standPosition,
              html: ReactDOMServer.renderToString(
                <ParkedAircraftLabel aircraft={aircraft} standName={layout.stand.name} />,
              ),
              layer: 10,
            },
          ]
        : [];

    return [...airportLayoutGlobeMarkers(scenes), ...parked];
  }, [scenes, standPosition, layout.stand, aircraft]);

  return <GlobeMap overlay={overlay} target={target} insets={NO_INSETS} markers={markers} interactive={false} />;
}
