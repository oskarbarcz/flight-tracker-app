import { cabinFrame } from "~/features/cabin-layout/lib/cabinFrame";
import { parseDesignator } from "~/features/cabin-layout/lib/designator";
import type { CabinSeat, CabinSeatMapDeck } from "~/features/cabin-layout/model";

function compareInCabin(left: CabinSeat, right: CabinSeat): number {
  const leftSeat = parseDesignator(left.designator);
  const rightSeat = parseDesignator(right.designator);

  if (leftSeat === null || rightSeat === null) {
    return left.designator.localeCompare(right.designator);
  }
  if (leftSeat.row !== rightSeat.row) {
    return leftSeat.row - rightSeat.row;
  }
  return leftSeat.letter.localeCompare(rightSeat.letter);
}

function buildOrder(deck: CabinSeatMapDeck): CabinSeat[] {
  const frame = cabinFrame(deck);
  if (frame === null) {
    return [...deck.seats].sort(compareInCabin);
  }

  const ordered = frame.sections.flatMap((section) => [...section.seats].sort(compareInCabin));
  const placed = new Set(ordered.map((seat) => seat.designator));

  return [...ordered, ...deck.seats.filter((seat) => !placed.has(seat.designator)).sort(compareInCabin)];
}

const orders = new WeakMap<CabinSeatMapDeck, CabinSeat[]>();

export function orderedSeats(deck: CabinSeatMapDeck): CabinSeat[] {
  const cached = orders.get(deck);
  if (cached !== undefined) {
    return cached;
  }

  const built = buildOrder(deck);
  orders.set(deck, built);
  return built;
}
