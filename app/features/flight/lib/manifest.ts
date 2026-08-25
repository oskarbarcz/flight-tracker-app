import { parseDesignator } from "~/features/cabin-layout/lib/designator";
import { CABIN_ORDER } from "~/features/cabin-layout/lib/seatAppearance";
import { seatIndex, seatKey } from "~/features/cabin-layout/lib/seatIndex";
import type { CabinClass, CabinSeatCounts, CabinSeatMap, Deck } from "~/features/cabin-layout/model";
import { type Flight, type Loadsheets, type ManifestPassenger, PassengerStatus } from "~/features/flight/model";

export type ManifestTally = {
  booked: number;
  boarded: number;
  noShow: number;
};

export type LayoutMismatch = {
  drawnFor: string;
  flying: string;
};

export type LoadsheetHeadcount = {
  label: string;
  passengers: number;
};

export type CabinTally = {
  cabin: CabinClass;
  boarded: number;
  seats: number | null;
};

export function layoutMismatch(flight: Flight): LayoutMismatch | null {
  const layout = flight.aircraft.cabinLayout;

  if (layout === null || !layout.mismatched) {
    return null;
  }

  return {
    drawnFor: `${layout.airlineIata} ${layout.aircraftIata}`,
    flying: `${flight.operator.iataCode} ${flight.aircraft.airframe.iataType} (${flight.aircraft.airframe.name})`,
  };
}

export function loadsheetHeadcount(loadsheets: Loadsheets): LoadsheetHeadcount | null {
  if (loadsheets.final !== null) {
    return { label: "The final loadsheet", passengers: loadsheets.final.passengers };
  }
  if (loadsheets.preliminary !== null) {
    return { label: "The preliminary loadsheet", passengers: loadsheets.preliminary.passengers };
  }
  return null;
}

const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });

export function compareNames(left: string, right: string): number {
  return collator.compare(left, right);
}

export function foldForSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase();
}

export function matchesQuery(passenger: ManifestPassenger, wanted: string): boolean {
  const folded = foldForSearch(wanted);

  return (
    foldForSearch(passenger.name).includes(folded) ||
    foldForSearch(passenger.designator).includes(folded) ||
    foldForSearch(passenger.pnr).includes(folded)
  );
}

export function passengersBySeat(passengers: ManifestPassenger[]): Map<string, ManifestPassenger> {
  return new Map(passengers.map((passenger) => [seatKey(passenger.deck, passenger.designator), passenger]));
}

function isBoarded(passenger: ManifestPassenger): boolean {
  return passenger.status === PassengerStatus.Boarded;
}

export function manifestTally(passengers: ManifestPassenger[]): ManifestTally {
  const boarded = passengers.filter(isBoarded);

  return {
    booked: passengers.length,
    boarded: boarded.length,
    noShow: passengers.length - boarded.length,
  };
}

export function cabinTallies(
  passengers: ManifestPassenger[],
  seatCounts: CabinSeatCounts | null,
  countEveryone = false,
): CabinTally[] {
  const counted = countEveryone ? passengers : passengers.filter(isBoarded);
  const present = new Set(passengers.map((passenger) => passenger.cabin));

  return CABIN_ORDER.filter((cabin) => present.has(cabin)).map((cabin) => ({
    cabin,
    boarded: counted.filter((passenger) => passenger.cabin === cabin).length,
    seats: seatCounts?.[cabin] ?? null,
  }));
}

export function orderedPassengers(passengers: ManifestPassenger[], decks: Deck[]): ManifestPassenger[] {
  const deckOrder = new Map(decks.map((deck, index) => [deck, index]));
  const rankOf = (passenger: ManifestPassenger) => deckOrder.get(passenger.deck) ?? decks.length;

  return [...passengers].sort((left, right) => {
    if (rankOf(left) !== rankOf(right)) {
      return rankOf(left) - rankOf(right);
    }

    const leftSeat = parseDesignator(left.designator);
    const rightSeat = parseDesignator(right.designator);

    if (leftSeat === null || rightSeat === null) {
      return collator.compare(left.designator, right.designator);
    }
    if (leftSeat.row !== rightSeat.row) {
      return leftSeat.row - rightSeat.row;
    }
    if (leftSeat.letter !== rightSeat.letter) {
      return collator.compare(leftSeat.letter, rightSeat.letter);
    }
    return compareNames(left.name, right.name);
  });
}

export function passengersOffDrawing(passengers: ManifestPassenger[], seatMap: CabinSeatMap): number {
  const seats = seatIndex(seatMap);

  return passengers.filter((passenger) => !seats.has(seatKey(passenger.deck, passenger.designator))).length;
}
