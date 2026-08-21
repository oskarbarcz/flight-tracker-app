export enum CabinClass {
  First = "first",
  Business = "business",
  PremiumEconomy = "premium_economy",
  Economy = "economy",
}

export enum Deck {
  Main = "main",
  Upper = "upper",
}

export enum LayoutMatch {
  Exact = "exact",
  Airline = "airline",
  AircraftType = "aircraft_type",
}

export enum SeatRating {
  Green = "green",
  Yellow = "yellow",
  Red = "red",
}

export enum WindowStatus {
  Great = "great",
  Average = "average",
  Poor = "poor",
  None = "none",
}

export enum CommentSentiment {
  Good = "good",
  Neutral = "neutral",
  Bad = "bad",
}

export enum CommentSeverity {
  Minor = "minor",
  Moderate = "moderate",
  Major = "major",
}

export type CabinLayout = {
  id: string;
  airlineIata: string;
  aircraftIata: string;
  variant: string | null;
  sourceSlugs: string[];
  firstSeenAt: string;
  retiredAt: string | null;
};

export type CabinLayoutSuggestion = CabinLayout & {
  match: LayoutMatch;
};

export type CabinLayoutList = {
  items: CabinLayout[];
  total: number;
  limit: number;
  offset: number;
};

export type CabinLayoutSuggestionList = {
  items: CabinLayoutSuggestion[];
  total: number;
};

export type AircraftCabinLayout = {
  id: string;
  airlineIata: string;
  aircraftIata: string;
  variant: string | null;
  revision: number | null;
  retired: boolean;
  mismatched: boolean;
};

export type SeatComment = {
  slug: string;
  comment: string;
  severity: CommentSeverity | null;
  sentiment: CommentSentiment;
};

export type CabinSeat = {
  designator: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  reversed: boolean;
  cabin: CabinClass;
  rating: SeatRating | null;
  color: string;
  bookable: boolean;
  blocked: boolean;
  crewRest: boolean;
  windowStatus: WindowStatus | null;
  seatProduct: string | null;
  comments: SeatComment[];
};

export type CabinDefinition = {
  code: string;
  name: string;
  rows: string;
  pitch: string | null;
  width: string | null;
  recline: string | null;
  seatCount: number;
  description: string | null;
};

export type CabinSeatMapCanvas = {
  width: number;
  height: number;
};

export type CabinSeatMapDeck = {
  deck: Deck;
  sourceSlug: string;
  canvas: CabinSeatMapCanvas;
  seatCount: number;
  lastUpdated: string;
  assets: Record<string, string>;
  cabins: CabinDefinition[];
  seats: CabinSeat[];
};

export type CabinSeatCounts = Partial<Record<CabinClass, number>> & { total: number };

export type CabinSeatMap = {
  layoutId: string;
  airlineIata: string;
  aircraftIata: string;
  revision: number;
  aircraftType: string;
  aircraftTypeDisplayed: string;
  manufacturer: string;
  haulType: string;
  isDualDeck: boolean;
  totalSeats: number;
  seatCounts: CabinSeatCounts;
  lastUpdated: string;
  fetchedAt: string;
  decks: CabinSeatMapDeck[];
};

export type CabinLayoutFilters = {
  airlineIata?: string;
  aircraftIata?: string;
  retired?: boolean;
  limit?: number;
  offset?: number;
};

export type CabinLayoutSyncResult = {
  reported: number;
  catalogued: number;
  created: number;
  retired: number;
  restored: number;
  skipped: number;
};

export type CabinLayoutRefreshResult = {
  layoutId: string;
  changed: boolean;
  revision: number;
};
