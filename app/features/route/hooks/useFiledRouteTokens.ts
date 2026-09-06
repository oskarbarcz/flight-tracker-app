import { useMemo } from "react";
import type { Flight } from "~/features/flight";
import { parseFiledRoute, type RouteToken } from "~/features/route/lib/filedRoute";
import type { PlannedRoute } from "~/features/route/model";
import type { AssignedRunways } from "~/features/runway/hooks/useAssignedRunways";

const NO_TOKENS: RouteToken[] = [];

export function useFiledRouteTokens(
  flight: Flight,
  route: PlannedRoute | null,
  runways: AssignedRunways,
): RouteToken[] {
  const departureIcao = flight.departureAirport.icaoCode;
  const destinationIcao = flight.destinationAirport.icaoCode;
  const departureRunway = runways.departure?.designator ?? null;
  const arrivalRunway = runways.arrival?.designator ?? null;

  return useMemo(() => {
    if (route === null) {
      return NO_TOKENS;
    }

    return parseFiledRoute(
      route,
      { icao: departureIcao, runway: departureRunway },
      { icao: destinationIcao, runway: arrivalRunway },
    );
  }, [route, departureIcao, destinationIcao, departureRunway, arrivalRunway]);
}
