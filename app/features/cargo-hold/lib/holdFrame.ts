import type { HoldCompartment, HoldDeck, HoldDeckName, HoldPosition, HoldVariant } from "~/features/cargo-hold/model";
import { ordinalOf, PositionSide, UldBase } from "~/features/cargo-hold/model";

const TAPER_INSET = 0.18;
const NOSE_RUN = 0.05;
const TAIL_RUN = 0.07;

const BASE_ACROSS_MM: Record<UldBase, number> = {
  [UldBase.K]: 1534,
  [UldBase.A]: 2235,
  [UldBase.M]: 2438,
};

const SPANNING_PALLET_ACROSS_MM = 3175;
const LOOSE_ACROSS_COEFFICIENT_MM = 600;
const LOOSE_ACROSS_MIN_MM = 1200;
const LOOSE_ACROSS_MAX_MM = 6000;
const ACROSS_MM_PER_PX = 28;
const MIN_DECK_HEIGHT_PX = 54;

export type PositionPlacement = {
  position: HoldPosition;
  start: number;
  length: number;
  top: number;
  height: number;
  tapered: boolean;
};

export type CompartmentPlacement = {
  compartment: HoldCompartment;
  start: number;
  length: number;
  ordinals: number;
  positions: PositionPlacement[];
};

export type DeckPlacement = {
  deck: HoldDeck;
  compartments: CompartmentPlacement[];
  acrossMm: number;
  heightPx: number;
};

export type HoldFrame = {
  decks: DeckPlacement[];
};

function ordinalsOf(compartment: HoldCompartment): string[] {
  const seen: string[] = [];
  for (const position of compartment.positions) {
    const ordinal = ordinalOf(position);
    if (!seen.includes(ordinal)) {
      seen.push(ordinal);
    }
  }
  return seen;
}

function baseFamilyOf(position: HoldPosition): string {
  return position.acceptedBases.join("");
}

function widestContoursPerFamily(deck: HoldDeck): Map<string, number> {
  const widest = new Map<string, number>();

  for (const compartment of deck.compartments) {
    for (const position of compartment.positions) {
      const family = baseFamilyOf(position);
      widest.set(family, Math.max(widest.get(family) ?? 0, position.acceptedContours.length));
    }
  }

  return widest;
}

function placePositions(
  compartment: HoldCompartment,
  start: number,
  length: number,
  widest: Map<string, number>,
): PositionPlacement[] {
  const ordinals = ordinalsOf(compartment);
  if (ordinals.length === 0) {
    return [];
  }

  const slot = length / ordinals.length;

  return compartment.positions.map((position) => {
    const ordinal = ordinalOf(position);
    const index = ordinals.indexOf(ordinal);
    const full = position.side === PositionSide.Full;

    return {
      position,
      start: start + index * slot,
      length: slot,
      top: full || position.side === PositionSide.Left ? 0 : 0.5,
      height: full ? 1 : 0.5,
      tapered: position.acceptedContours.length < (widest.get(baseFamilyOf(position)) ?? 0),
    };
  });
}

function positionAcrossMm(position: HoldPosition): number {
  const widest = Math.max(...position.acceptedBases.map((base) => BASE_ACROSS_MM[base]));

  if (position.side !== PositionSide.Full) {
    return widest * 2;
  }

  return position.acceptedBases.some((base) => base !== UldBase.K) ? SPANNING_PALLET_ACROSS_MM : widest;
}

function looseAcrossMm(volumeM3: number): number {
  const estimate = LOOSE_ACROSS_COEFFICIENT_MM * Math.cbrt(volumeM3);
  return Math.min(Math.max(estimate, LOOSE_ACROSS_MIN_MM), LOOSE_ACROSS_MAX_MM);
}

function deckVolumeM3(deck: HoldDeck): number {
  return deck.compartments.reduce((sum, compartment) => sum + compartment.volumeM3, 0);
}

export function acrossByDeckOf(variants: HoldVariant[]): Map<HoldDeckName, number> {
  const fromPositions = new Map<HoldDeckName, number>();
  const fromVolume = new Map<HoldDeckName, number>();

  for (const variant of variants) {
    for (const deck of variant.decks) {
      const positions = deck.compartments.flatMap((compartment) => compartment.positions);
      if (positions.length > 0) {
        const across = Math.max(...positions.map(positionAcrossMm));
        fromPositions.set(deck.deck, Math.max(fromPositions.get(deck.deck) ?? 0, across));
      }
      fromVolume.set(deck.deck, Math.max(fromVolume.get(deck.deck) ?? 0, deckVolumeM3(deck)));
    }
  }

  const across = new Map<HoldDeckName, number>();
  for (const [name, volume] of fromVolume) {
    across.set(name, fromPositions.get(name) ?? looseAcrossMm(volume));
  }
  return across;
}

function placeDeck(deck: HoldDeck, acrossMm: number): DeckPlacement {
  const total = deckVolumeM3(deck);
  const usable = 1 - NOSE_RUN - TAIL_RUN;
  const widest = widestContoursPerFamily(deck);

  let cursor = NOSE_RUN;
  const compartments = deck.compartments.map((compartment) => {
    const share = total === 0 ? usable / deck.compartments.length : (compartment.volumeM3 / total) * usable;
    const placement: CompartmentPlacement = {
      compartment,
      start: cursor,
      length: share,
      ordinals: ordinalsOf(compartment).length,
      positions: placePositions(compartment, cursor, share, widest),
    };
    cursor += share;
    return placement;
  });

  return {
    deck,
    compartments,
    acrossMm,
    heightPx: Math.max(Math.round(acrossMm / ACROSS_MM_PER_PX), MIN_DECK_HEIGHT_PX),
  };
}

export function holdFrame(variant: HoldVariant, variants: HoldVariant[] = [variant]): HoldFrame {
  const across = acrossByDeckOf(variants);
  return {
    decks: variant.decks.map((deck) => placeDeck(deck, across.get(deck.deck) ?? looseAcrossMm(deckVolumeM3(deck)))),
  };
}

function envelopeVertices(): Array<[number, number]> {
  const nose = NOSE_RUN * 100;
  const tail = (1 - TAIL_RUN) * 100;
  const top = TAPER_INSET * 100;
  const bottom = 100 - top;

  return [
    [0, top],
    [nose, 0],
    [tail, 0],
    [100, top],
    [100, bottom],
    [tail, 100],
    [nose, 100],
    [0, bottom],
  ];
}

export function envelopeClipPath(): string {
  const points = envelopeVertices()
    .map(([x, y]) => `${x}% ${y}%`)
    .join(", ");
  return `polygon(${points})`;
}

export function envelopePoints(): string {
  return envelopeVertices()
    .map(([x, y]) => `${x},${y}`)
    .join(" ");
}
