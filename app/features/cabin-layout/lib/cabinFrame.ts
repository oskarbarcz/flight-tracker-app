import { parseDesignator } from "~/features/cabin-layout/lib/designator";
import { type CabinClass, type CabinSeat, type CabinSeatMapDeck, Deck } from "~/features/cabin-layout/model";

const WALL_MARGIN = 0.06;
const CAP_MARGIN = 0.06;
const GUTTER_SEATS = 1.15;
const MIN_SEAT_ALONG_PX = 12;
const MIN_LETTER_SPACING_PX = 9;

export type CabinLetter = {
  letter: string;
  across: number;
};

export type CabinSection = {
  cabin: CabinClass;
  firstRow: string;
  lastRow: string;
  seats: CabinSeat[];
  letters: CabinLetter[];
  gutterStart: number;
  contentStart: number;
  contentLength: number;
  sourceStart: number;
};

export type CabinFrame = {
  length: number;
  width: number;
  acrossOrigin: number;
  noseLength: number;
  tailLength: number;
  gutter: number;
  rowCount: number;
  sections: CabinSection[];
};

type Row = {
  label: string;
  seats: CabinSeat[];
  start: number;
};

function readRows(deck: CabinSeatMapDeck): Row[] {
  const rows = new Map<string, CabinSeat[]>();
  for (const seat of deck.seats) {
    const parsed = parseDesignator(seat.designator);
    const label = parsed === null ? seat.designator : String(parsed.row);
    const existing = rows.get(label);
    if (existing) {
      existing.push(seat);
    } else {
      rows.set(label, [seat]);
    }
  }

  return [...rows.entries()]
    .map(([label, seats]) => ({ label, seats, start: Math.min(...seats.map((seat) => seat.y)) }))
    .sort((left, right) => left.start - right.start);
}

function dominantCabin(seats: CabinSeat[]): CabinClass {
  const tally = new Map<CabinClass, number>();
  for (const seat of seats) {
    tally.set(seat.cabin, (tally.get(seat.cabin) ?? 0) + 1);
  }
  return [...tally.entries()].sort(([, left], [, right]) => right - left)[0][0];
}

function lettersOf(seats: CabinSeat[]): CabinLetter[] {
  const groups = new Map<string, number[]>();
  for (const seat of seats) {
    const parsed = parseDesignator(seat.designator);
    if (parsed === null) {
      continue;
    }
    const centre = seat.x + seat.width / 2;
    const existing = groups.get(parsed.letter);
    if (existing) {
      existing.push(centre);
    } else {
      groups.set(parsed.letter, [centre]);
    }
  }

  return [...groups.entries()]
    .map(([letter, centres]) => ({
      letter,
      across: centres.reduce((total, value) => total + value, 0) / centres.length,
    }))
    .sort((left, right) => left.across - right.across);
}

function buildFrame(deck: CabinSeatMapDeck): CabinFrame | null {
  const rows = readRows(deck);
  if (rows.length === 0) {
    return null;
  }

  const grouped: Row[][] = [];
  for (const row of rows) {
    const previous = grouped.at(-1);
    if (previous && dominantCabin(previous.flatMap((entry) => entry.seats)) === dominantCabin(row.seats)) {
      previous.push(row);
    } else {
      grouped.push([row]);
    }
  }

  const acrossStart = Math.min(...deck.seats.map((seat) => seat.x));
  const acrossEnd = Math.max(...deck.seats.map((seat) => seat.x + seat.width));
  const alongStart = Math.min(...deck.seats.map((seat) => seat.y));
  const alongEnd = Math.max(...deck.seats.map((seat) => seat.y + seat.height));

  const width = (acrossEnd - acrossStart) * (1 + WALL_MARGIN * 2);
  const acrossOrigin = (acrossStart + acrossEnd) / 2 - width / 2;
  const gutter = (deck.seats.reduce((total, seat) => total + seat.height, 0) / deck.seats.length) * GUTTER_SEATS;

  const isMain = deck.deck === Deck.Main;
  const cap = (alongEnd - alongStart) * CAP_MARGIN;
  const noseLength = isMain ? alongStart : cap;
  const tailLength = isMain ? deck.canvas.height - alongEnd : cap;

  let cursor = noseLength;
  const sections = grouped.map((group) => {
    const seats = group.flatMap((row) => row.seats);
    const sourceStart = Math.min(...seats.map((seat) => seat.y));
    const sourceEnd = Math.max(...seats.map((seat) => seat.y + seat.height));
    const gutterStart = cursor;
    const contentStart = cursor + gutter;
    const contentLength = sourceEnd - sourceStart;
    cursor = contentStart + contentLength;

    return {
      cabin: dominantCabin(seats),
      firstRow: group[0].label,
      lastRow: group[group.length - 1].label,
      seats,
      letters: lettersOf(seats),
      gutterStart,
      contentStart,
      contentLength,
      sourceStart,
    };
  });

  return {
    length: cursor + tailLength,
    width,
    acrossOrigin,
    noseLength,
    tailLength,
    gutter,
    rowCount: rows.length,
    sections,
  };
}

const frames = new WeakMap<CabinSeatMapDeck, CabinFrame | null>();

export function cabinFrame(deck: CabinSeatMapDeck): CabinFrame | null {
  const cached = frames.get(deck);
  if (cached !== undefined) {
    return cached;
  }

  const built = buildFrame(deck);
  frames.set(deck, built);
  return built;
}

export function widestFrame(decks: CabinSeatMapDeck[]): number {
  return Math.max(...decks.map((deck) => cabinFrame(deck)?.length ?? 0), 1);
}

function tightestLetterGap(frame: CabinFrame): number {
  let tightest = Number.POSITIVE_INFINITY;
  for (const section of frame.sections) {
    for (let index = 1; index < section.letters.length; index += 1) {
      tightest = Math.min(tightest, section.letters[index].across - section.letters[index - 1].across);
    }
  }
  return tightest;
}

export function minimumScale(decks: CabinSeatMapDeck[]): number {
  let scale = 0;

  for (const deck of decks) {
    const frame = cabinFrame(deck);
    if (frame === null) {
      return scale;
    }

    const meanSeatAlong = deck.seats.reduce((total, seat) => total + seat.height, 0) / deck.seats.length;
    scale = Math.max(scale, MIN_SEAT_ALONG_PX / meanSeatAlong);

    const gap = tightestLetterGap(frame);
    if (Number.isFinite(gap) && gap > 0) {
      scale = Math.max(scale, MIN_LETTER_SPACING_PX / gap);
    }
  }

  return scale;
}

export function fuselagePath({ length, width, noseLength, tailLength }: CabinFrame): string {
  const nose = Math.max(noseLength, width * 0.12);
  const tail = Math.max(tailLength, width * 0.12);

  return [
    `M ${nose} 0`,
    `C ${nose * 0.45} 0 0 ${width * 0.24} 0 ${width * 0.5}`,
    `C 0 ${width * 0.76} ${nose * 0.45} ${width} ${nose} ${width}`,
    `L ${length - tail} ${width}`,
    `C ${length - tail * 0.3} ${width} ${length} ${width * 0.78} ${length} ${width * 0.56}`,
    `L ${length} ${width * 0.44}`,
    `C ${length} ${width * 0.22} ${length - tail * 0.3} 0 ${length - tail} 0`,
    "Z",
  ].join(" ");
}
