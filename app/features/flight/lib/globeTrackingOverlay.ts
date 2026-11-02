import type { Airport } from "~/features/airport";
import type { FlightPathElement } from "~/features/flight";
import { airportRoute } from "~/features/flight/lib/flightMapBounds";
import { buildColoredSegments } from "~/features/flight/lib/flightPathSegments";
import type { GlobeOverlay } from "~/shared/lib/globeStyle";
import { lineSource } from "~/shared/lib/globeStyle";
import { FLIGHT_COLOR } from "~/shared/lib/mapColors";

const DIVERSION_COLOR = "#dc2626";

export function flightPathOverlay(path: FlightPathElement[]): GlobeOverlay {
  return {
    sources: {
      "tracking-path": lineSource(
        buildColoredSegments(path).map((segment) => ({
          path: segment.positions,
          properties: { color: segment.color },
        })),
      ),
    },
    layers: [
      {
        id: "tracking-path",
        type: "line",
        source: "tracking-path",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": ["get", "color"], "line-width": 4 },
      },
    ],
  };
}

function airportLink(id: string, start: Airport, end: Airport, color: string, opacity: number): GlobeOverlay {
  return {
    sources: { [id]: lineSource([{ path: airportRoute(start, end) }]) },
    layers: [
      {
        id,
        type: "line",
        source: id,
        paint: { "line-color": color, "line-width": 2, "line-opacity": opacity, "line-dasharray": [3, 3] },
      },
    ],
  };
}

export function directRouteOverlay(departure: Airport, destination: Airport, emphasis = 1): GlobeOverlay {
  return airportLink("tracking-direct-route", departure, destination, FLIGHT_COLOR, 0.8 * emphasis);
}

export function diversionOverlay(origin: Airport, diversionAirport: Airport): GlobeOverlay {
  return airportLink("tracking-diversion", origin, diversionAirport, DIVERSION_COLOR, 0.9);
}
