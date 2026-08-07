import { useOutletContext } from "react-router";
import type { Continent } from "~/features/airport";

export type AirportListContext = {
  continent: Continent;
  reload: () => void;
};

export function useAirportList(): AirportListContext {
  return useOutletContext<AirportListContext>();
}

export function airportListPath(continent: Continent): string {
  return `/airports?continent=${continent}`;
}

export function createAirportPath(continent: Continent): string {
  return `/airports/new?continent=${continent}`;
}
