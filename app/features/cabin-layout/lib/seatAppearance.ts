import type { ReactNode } from "react";
import { CabinClass, type CabinSeat, type Deck, SeatRating } from "~/features/cabin-layout/model";
import { toHuman } from "~/i18n/translate";

export type SeatAppearance = {
  fill: string;
  label: string;
};

export type SeatResolver = (seat: CabinSeat, deck: Deck) => SeatAppearance;

export type SeatLegendEntry = {
  key: string;
  label: string;
  fill: string;
};

export type SeatMode = {
  resolve: SeatResolver;
  legend: (seats: CabinSeat[], deck: Deck) => SeatLegendEntry[];
  tooltip?: (seat: CabinSeat, deck: Deck) => ReactNode;
};

export enum SeatCondition {
  Blocked = "blocked",
  CrewRest = "crew_rest",
  Unbookable = "unbookable",
}

export const CABIN_ORDER: CabinClass[] = [
  CabinClass.First,
  CabinClass.Business,
  CabinClass.PremiumEconomy,
  CabinClass.Economy,
];

export const CABIN_SHORT_LABELS: Record<CabinClass, string> = {
  [CabinClass.First]: "First",
  [CabinClass.Business]: "Business",
  [CabinClass.PremiumEconomy]: "Premium",
  [CabinClass.Economy]: "Economy",
};

export const CABIN_FILLS: Record<CabinClass, string> = {
  [CabinClass.First]: "bg-indigo-800 border-indigo-900 dark:bg-indigo-200 dark:border-indigo-100",
  [CabinClass.Business]: "bg-indigo-600 border-indigo-800 dark:bg-indigo-400 dark:border-indigo-200",
  [CabinClass.PremiumEconomy]: "bg-indigo-400 border-indigo-600 dark:bg-indigo-600 dark:border-indigo-400",
  [CabinClass.Economy]: "bg-indigo-200 border-indigo-400 dark:bg-indigo-800 dark:border-indigo-600",
};

const RATING_ORDER: SeatRating[] = [SeatRating.Green, SeatRating.Yellow, SeatRating.Red];

const RATING_FILLS: Record<SeatRating, string> = {
  [SeatRating.Green]: "bg-emerald-500 border-emerald-800 dark:bg-emerald-400 dark:border-emerald-200",
  [SeatRating.Yellow]: "bg-amber-400 border-amber-700 border-dashed dark:bg-amber-300 dark:border-amber-100",
  [SeatRating.Red]: "bg-rose-500 border-2 border-rose-900 dark:bg-rose-400 dark:border-rose-200",
};

const UNRATED_FILL = "bg-gray-100 border-dotted border-gray-500 dark:bg-gray-700 dark:border-gray-400";

const UNRATED_LABEL = "Not rated";

export const CONDITION_LABELS: Record<SeatCondition, string> = {
  [SeatCondition.Blocked]: "Blocked",
  [SeatCondition.CrewRest]: "Crew rest",
  [SeatCondition.Unbookable]: "Not bookable",
};

export function seatCondition(seat: CabinSeat): SeatCondition | null {
  if (seat.blocked) {
    return SeatCondition.Blocked;
  }
  if (seat.crewRest) {
    return SeatCondition.CrewRest;
  }
  if (!seat.bookable) {
    return SeatCondition.Unbookable;
  }
  return null;
}

export const cabinClassMode: SeatMode = {
  resolve: (seat) => ({
    fill: CABIN_FILLS[seat.cabin],
    label: toHuman.cabinLayout.cabinClass(seat.cabin),
  }),
  legend: (seats) => {
    const present = new Set(seats.map((seat) => seat.cabin));
    return CABIN_ORDER.filter((cabin) => present.has(cabin)).map((cabin) => ({
      key: cabin,
      label: toHuman.cabinLayout.cabinClass(cabin),
      fill: CABIN_FILLS[cabin],
    }));
  },
};

export const ratingMode: SeatMode = {
  resolve: (seat) =>
    seat.rating === null
      ? { fill: UNRATED_FILL, label: UNRATED_LABEL }
      : { fill: RATING_FILLS[seat.rating], label: toHuman.cabinLayout.seatRating(seat.rating) },
  legend: (seats) => {
    const present = new Set(seats.map((seat) => seat.rating));
    const rated = RATING_ORDER.filter((rating) => present.has(rating)).map((rating) => ({
      key: rating,
      label: toHuman.cabinLayout.seatRating(rating),
      fill: RATING_FILLS[rating],
    }));

    return present.has(null) ? [...rated, { key: "unrated", label: UNRATED_LABEL, fill: UNRATED_FILL }] : rated;
  },
};
