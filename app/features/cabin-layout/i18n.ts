import {
  CabinClass,
  CommentSentiment,
  CommentSeverity,
  Deck,
  LayoutMatch,
  SeatRating,
  WindowStatus,
} from "~/features/cabin-layout/model";

const cabinClassLabels: Record<CabinClass, string> = {
  [CabinClass.First]: "First",
  [CabinClass.Business]: "Business",
  [CabinClass.PremiumEconomy]: "Premium economy",
  [CabinClass.Economy]: "Economy",
};

const deckLabels: Record<Deck, string> = {
  [Deck.Main]: "Main deck",
  [Deck.Upper]: "Upper deck",
};

const layoutMatchLabels: Record<LayoutMatch, string> = {
  [LayoutMatch.Exact]: "Same airline and aircraft type",
  [LayoutMatch.Airline]: "Same airline",
  [LayoutMatch.AircraftType]: "Same aircraft type",
};

const seatRatingLabels: Record<SeatRating, string> = {
  [SeatRating.Green]: "Good seat",
  [SeatRating.Yellow]: "Mixed reviews",
  [SeatRating.Red]: "Poor seat",
};

const windowStatusLabels: Record<WindowStatus, string> = {
  [WindowStatus.Great]: "Well aligned window",
  [WindowStatus.Average]: "Average window",
  [WindowStatus.Poor]: "Poorly aligned window",
  [WindowStatus.None]: "No window",
};

const commentSentimentLabels: Record<CommentSentiment, string> = {
  [CommentSentiment.Good]: "In favour",
  [CommentSentiment.Neutral]: "Neutral",
  [CommentSentiment.Bad]: "Against",
};

const commentSeverityLabels: Record<CommentSeverity, string> = {
  [CommentSeverity.Minor]: "Minor",
  [CommentSeverity.Moderate]: "Moderate",
  [CommentSeverity.Major]: "Major",
};

export function translateCabinClass(cabin: CabinClass): string {
  return cabinClassLabels[cabin] ?? cabin;
}

export function translateDeck(deck: Deck): string {
  return deckLabels[deck] ?? deck;
}

export function translateLayoutMatch(match: LayoutMatch): string {
  return layoutMatchLabels[match] ?? match;
}

export function translateSeatRating(rating: SeatRating): string {
  return seatRatingLabels[rating] ?? rating;
}

export function translateWindowStatus(status: WindowStatus): string {
  return windowStatusLabels[status] ?? status;
}

export function translateCommentSentiment(sentiment: CommentSentiment): string {
  return commentSentimentLabels[sentiment] ?? sentiment;
}

export function translateCommentSeverity(severity: CommentSeverity): string {
  return commentSeverityLabels[severity] ?? severity;
}
