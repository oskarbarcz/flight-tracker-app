import React from "react";
import type { SeatMode } from "~/features/cabin-layout/lib/seatAppearance";
import { seatKey } from "~/features/cabin-layout/lib/seatIndex";
import type { CabinSeat, Deck } from "~/features/cabin-layout/model";
import { SeatOccupantFacts } from "~/features/flight/components/Cabin/SeatOccupantFacts";
import { passengersBySeat } from "~/features/flight/lib/manifest";
import { type ManifestPassenger, PassengerStatus } from "~/features/flight/model";

export enum SeatOccupancy {
  Boarded = "boarded",
  SpecialService = "special_service",
  NoShow = "no_show",
  Empty = "empty",
}

const OCCUPANCY_ORDER: SeatOccupancy[] = [
  SeatOccupancy.Boarded,
  SeatOccupancy.SpecialService,
  SeatOccupancy.NoShow,
  SeatOccupancy.Empty,
];

const OCCUPANCY_FILLS: Record<SeatOccupancy, string> = {
  [SeatOccupancy.Boarded]: "bg-indigo-600 border-indigo-800 dark:bg-indigo-400 dark:border-indigo-200",
  [SeatOccupancy.SpecialService]: "bg-amber-400 border-amber-700 dark:bg-amber-300 dark:border-amber-100",
  [SeatOccupancy.NoShow]: "bg-rose-100 border-dashed border-rose-500 dark:bg-rose-950 dark:border-rose-400",
  [SeatOccupancy.Empty]: "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-600",
};

const OCCUPANCY_LABELS: Record<SeatOccupancy, string> = {
  [SeatOccupancy.Boarded]: "Boarded",
  [SeatOccupancy.SpecialService]: "Special service",
  [SeatOccupancy.NoShow]: "No-show",
  [SeatOccupancy.Empty]: "Empty",
};

function occupancyOf(passenger: ManifestPassenger | undefined): SeatOccupancy {
  if (passenger === undefined) {
    return SeatOccupancy.Empty;
  }
  if (passenger.status === PassengerStatus.NoShow) {
    return SeatOccupancy.NoShow;
  }
  return passenger.ssr === null ? SeatOccupancy.Boarded : SeatOccupancy.SpecialService;
}

export function occupancyMode(passengers: ManifestPassenger[]): SeatMode {
  const seated = passengersBySeat(passengers);
  const occupantOf = (seat: CabinSeat, deck: Deck) => seated.get(seatKey(deck, seat.designator));

  return {
    resolve: (seat, deck) => {
      const occupancy = occupancyOf(occupantOf(seat, deck));

      return { fill: OCCUPANCY_FILLS[occupancy], label: OCCUPANCY_LABELS[occupancy] };
    },
    legend: (seats, deck) => {
      const present = new Set(seats.map((seat) => occupancyOf(occupantOf(seat, deck))));

      return OCCUPANCY_ORDER.filter((occupancy) => present.has(occupancy)).map((occupancy) => ({
        key: occupancy,
        label: OCCUPANCY_LABELS[occupancy],
        fill: OCCUPANCY_FILLS[occupancy],
      }));
    },
    tooltip: (seat, deck) => <SeatOccupantFacts seat={seat} passenger={occupantOf(seat, deck) ?? null} />,
  };
}
