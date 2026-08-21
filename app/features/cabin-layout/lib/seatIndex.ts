import type { CabinSeat, CabinSeatMap, Deck } from "~/features/cabin-layout/model";

export function seatKey(deck: Deck, designator: string): string {
  return `${deck}:${designator}`;
}

export function seatIndex(seatMap: CabinSeatMap): Map<string, CabinSeat> {
  const index = new Map<string, CabinSeat>();

  for (const deck of seatMap.decks) {
    for (const seat of deck.seats) {
      index.set(seatKey(deck.deck, seat.designator), seat);
    }
  }

  return index;
}
