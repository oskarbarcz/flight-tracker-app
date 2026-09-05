export enum FlightDataTab {
  Overview,
  FuelAndCrew,
  Passengers,
  Cargo,
  FlightProgress,
  Route,
  OperationalFlightPlan,
  RunwayAnalysis,
  EmergenciesDiversions,
  Delays,
}

const TAB_SLUG: Record<FlightDataTab, string> = {
  [FlightDataTab.Overview]: "overview",
  [FlightDataTab.FuelAndCrew]: "fuel-and-crew",
  [FlightDataTab.Passengers]: "passengers",
  [FlightDataTab.Cargo]: "cargo",
  [FlightDataTab.FlightProgress]: "progress",
  [FlightDataTab.Route]: "route",
  [FlightDataTab.OperationalFlightPlan]: "ofp",
  [FlightDataTab.RunwayAnalysis]: "runway-analysis",
  [FlightDataTab.EmergenciesDiversions]: "emergencies",
  [FlightDataTab.Delays]: "delays",
};

export function flightDataTabSlug(tab: FlightDataTab): string {
  return TAB_SLUG[tab];
}

export function flightDataTabFromSlug(slug: string | undefined): FlightDataTab {
  const found = Object.entries(TAB_SLUG).find(([, candidate]) => candidate === slug);

  return found === undefined ? FlightDataTab.Overview : (Number(found[0]) as FlightDataTab);
}
