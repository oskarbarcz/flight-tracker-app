import { parseDesignator } from "~/features/cabin-layout/lib/designator";
import { CABIN_ORDER } from "~/features/cabin-layout/lib/seatAppearance";
import { CabinClass, type CabinDefinition, type CabinSeat, type CabinSeatMapDeck } from "~/features/cabin-layout/model";

const CABIN_BY_CODE: Record<string, CabinClass> = {
  F: CabinClass.First,
  J: CabinClass.Business,
  W: CabinClass.PremiumEconomy,
  M: CabinClass.Economy,
};

const RANGE_SEPARATOR = "–";
const INCHES = /(\d+(?:\.\d+)?)\s*["”]/g;
const CENTIMETRES_PER_INCH = 2.54;

export type CabinFacts = {
  cabin: CabinClass;
  definition: CabinDefinition | null;
  seats: number;
  rows: string;
  abreast: number | null;
  dispute: CabinDispute | null;
};

export type CabinDispute = {
  seats: number;
  rows: string;
};

function cabinOfCode(code: string): CabinClass | null {
  return CABIN_BY_CODE[code.trim().toUpperCase()] ?? null;
}

function rowNumbers(seats: CabinSeat[]): number[] {
  const rows = new Set<number>();

  for (const seat of seats) {
    const parsed = parseDesignator(seat.designator);
    if (parsed !== null) {
      rows.add(parsed.row);
    }
  }

  return [...rows].sort((left, right) => left - right);
}

export function formatRowSpan(rows: number[]): string {
  const spans: string[] = [];
  let start: number | null = null;
  let previous = 0;

  for (const row of rows) {
    if (start === null) {
      start = row;
    } else if (row !== previous + 1) {
      spans.push(start === previous ? String(start) : `${start}${RANGE_SEPARATOR}${previous}`);
      start = row;
    }
    previous = row;
  }

  if (start !== null) {
    spans.push(start === previous ? String(start) : `${start}${RANGE_SEPARATOR}${previous}`);
  }

  return spans.join(", ");
}

function seatsAbreast(seats: CabinSeat[]): number | null {
  const widths = new Map<number, number>();

  for (const seat of seats) {
    const parsed = parseDesignator(seat.designator);
    if (parsed !== null) {
      widths.set(parsed.row, (widths.get(parsed.row) ?? 0) + 1);
    }
  }

  return widths.size === 0 ? null : Math.max(...widths.values());
}

function claimedRows(rows: string): number[] {
  const claimed = new Set<number>();

  for (const part of rows.split(",")) {
    const figures = part.match(/\d+/g)?.map(Number) ?? [];
    if (figures.length === 0) {
      continue;
    }
    for (let row = Math.min(...figures); row <= Math.max(...figures); row += 1) {
      claimed.add(row);
    }
  }

  return [...claimed].sort((left, right) => left - right);
}

function contradicts(definition: CabinDefinition, seats: CabinSeat[], rows: number[]): boolean {
  if (definition.seatCount !== seats.length) {
    return true;
  }

  const claimed = new Set(claimedRows(definition.rows));
  return rows.some((row) => !claimed.has(row));
}

export function cabinFacts(deck: CabinSeatMapDeck): CabinFacts[] {
  const described = new Map<CabinClass, CabinDefinition>();

  for (const definition of deck.cabins) {
    const cabin = cabinOfCode(definition.code);
    if (cabin !== null && !described.has(cabin)) {
      described.set(cabin, definition);
    }
  }

  const seated = new Set(deck.seats.map((seat) => seat.cabin));
  const present = CABIN_ORDER.filter((cabin) => seated.has(cabin) || described.has(cabin));

  return present.map((cabin) => {
    const definition = described.get(cabin) ?? null;
    const seats = deck.seats.filter((seat) => seat.cabin === cabin);
    const rows = rowNumbers(seats);

    return {
      cabin,
      definition,
      seats: seats.length,
      rows: formatRowSpan(rows),
      abreast: seatsAbreast(seats),
      dispute:
        definition !== null && contradicts(definition, seats, rows)
          ? { seats: definition.seatCount, rows: definition.rows }
          : null,
    };
  });
}

export function centimetresOf(measure: string | null): string | null {
  if (measure === null) {
    return null;
  }

  const inches = [...measure.matchAll(INCHES)].map((match) => Math.round(Number(match[1]) * CENTIMETRES_PER_INCH));
  if (inches.length === 0) {
    return null;
  }

  const least = Math.min(...inches);
  const most = Math.max(...inches);
  return least === most ? `~${least}cm` : `~${least}${RANGE_SEPARATOR}${most}cm`;
}
