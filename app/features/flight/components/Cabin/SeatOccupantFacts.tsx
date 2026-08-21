import React from "react";
import { TooltipRow } from "~/features/cabin-layout/components/SeatMap/TooltipRow";
import { CONDITION_LABELS, seatCondition } from "~/features/cabin-layout/lib/seatAppearance";
import type { CabinSeat } from "~/features/cabin-layout/model";
import type { ManifestPassenger } from "~/features/flight/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  seat: CabinSeat;
  passenger: ManifestPassenger | null;
};

export function SeatOccupantFacts({ seat, passenger }: Props) {
  const condition = seatCondition(seat);

  if (passenger === null) {
    return (
      <dl className="mt-1 grid grid-cols-[auto_auto] gap-x-3 text-xs">
        <TooltipRow label="Seat" value={condition === null ? "Empty" : CONDITION_LABELS[condition]} />
      </dl>
    );
  }

  return (
    <dl className="mt-1 grid grid-cols-[auto_auto] gap-x-3 text-xs">
      <TooltipRow label="Passenger" value={passenger.name} />
      <TooltipRow label="Booking" value={<span className="font-mono">{passenger.pnr}</span>} />
      <TooltipRow label="Status" value={toHuman.flight.passengerStatus(passenger.status)} />
      {passenger.ssr !== null && (
        <TooltipRow label="Service" value={toHuman.flight.specialServiceRequest(passenger.ssr)} />
      )}
    </dl>
  );
}
