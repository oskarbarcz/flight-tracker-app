import { parseDesignator } from "~/features/cabin-layout/lib/designator";
import { CABIN_ORDER } from "~/features/cabin-layout/lib/seatAppearance";
import { seatIndex, seatKey } from "~/features/cabin-layout/lib/seatIndex";
import type { CabinClass, CabinSeatCounts, CabinSeatMap, Deck } from "~/features/cabin-layout/model";
import { type Loadsheets, type ManifestPassenger, PassengerStatus } from "~/features/flight/model";

export type ManifestTally = {
  booked: number;
  boarded: number;
  noShow: number;
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

export function loadsheetHeadcount(loadsheets: Loadsheets): LoadsheetHeadcount | null {
  if (loadsheets.final !== null) {
    return { label: "The final loadsheet", passengers: loadsheets.final.passengers };
  }
  if (loadsheets.preliminary !== null) {
    return { label: "The preliminary loadsheet", passengers: loadsheets.preliminary.passengers };
  }
  return null;
}

export function matchesQuery(passenger: ManifestPassenger, wanted: string): boolean {
  return (
    passenger.name.toUpperCase().includes(wanted) ||
    passenger.designator.toUpperCase().includes(wanted) ||
    passenger.pnr.toUpperCase().includes(wanted)
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

export function cabinTallies(passengers: ManifestPassenger[], seatCounts: CabinSeatCounts | null): CabinTally[] {
  const boarded = passengers.filter(isBoarded);
  const present = new Set(passengers.map((passenger) => passenger.cabin));

  return CABIN_ORDER.filter((cabin) => present.has(cabin)).map((cabin) => ({
    cabin,
    boarded: boarded.filter((passenger) => passenger.cabin === cabin).length,
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
      return left.designator.localeCompare(right.designator);
    }
    if (leftSeat.row !== rightSeat.row) {
      return leftSeat.row - rightSeat.row;
    }
    return leftSeat.letter.localeCompare(rightSeat.letter);
  });
}

export function passengersOffDrawing(passengers: ManifestPassenger[], seatMap: CabinSeatMap): number {
  const seats = seatIndex(seatMap);

  return passengers.filter((passenger) => !seats.has(seatKey(passenger.deck, passenger.designator))).length;
}
