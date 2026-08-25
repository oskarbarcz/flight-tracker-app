import type { Aircraft } from "~/features/aircraft/model";

export type CabinLayoutDisagreement =
  | { kind: "airline"; layout: string; aircraft: string }
  | { kind: "aircraftType"; layout: string; aircraft: string | null };

export function isCabinLayoutMismatched(aircraft: Aircraft): boolean {
  return aircraft.cabinLayout?.mismatched === true;
}

export function cabinLayoutDisagreements(aircraft: Aircraft, airlineIata: string): CabinLayoutDisagreement[] {
  const layout = aircraft.cabinLayout;

  if (layout === null || !layout.mismatched) {
    return [];
  }

  const disagreements: CabinLayoutDisagreement[] = [];

  if (layout.airlineIata !== airlineIata) {
    disagreements.push({ kind: "airline", layout: layout.airlineIata, aircraft: airlineIata });
  }

  const iataType = aircraft.airframe.iataType;

  if (iataType === null || layout.aircraftIata !== iataType) {
    disagreements.push({ kind: "aircraftType", layout: layout.aircraftIata, aircraft: iataType });
  }

  return disagreements;
}

export function describeDisagreements(disagreements: CabinLayoutDisagreement[]): string {
  return disagreements.length === 0
    ? "the catalogue reports it as drawn for another aircraft"
    : disagreements.map(describeDisagreement).join(", and ");
}

export function describeDisagreement(disagreement: CabinLayoutDisagreement): string {
  if (disagreement.kind === "airline") {
    return `it is ${disagreement.layout}'s cabin, not ${disagreement.aircraft}'s`;
  }

  return disagreement.aircraft === null
    ? `it is drawn for ${disagreement.layout}, and this airframe publishes no IATA type code`
    : `it is drawn for ${disagreement.layout}, not ${disagreement.aircraft}`;
}
