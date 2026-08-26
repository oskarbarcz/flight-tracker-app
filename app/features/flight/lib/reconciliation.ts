import { seatKey } from "~/features/cabin-layout/lib/seatIndex";
import { type FlightManifest, PassengerStatus } from "~/features/flight/model";

export type ManifestReconciliation = {
  added: number;
  noShows: number;
};

export function reconcileManifest(released: FlightManifest, boarded: FlightManifest): ManifestReconciliation | null {
  const seated = new Map(
    released.passengers.map((passenger) => [seatKey(passenger.deck, passenger.designator), passenger]),
  );

  let added = 0;
  let noShows = 0;

  for (const passenger of boarded.passengers) {
    const before = seated.get(seatKey(passenger.deck, passenger.designator));

    if (before === undefined) {
      added += 1;
      continue;
    }

    if (passenger.status === PassengerStatus.NoShow && before.status !== PassengerStatus.NoShow) {
      noShows += 1;
    }
  }

  return added === 0 && noShows === 0 ? null : { added, noShows };
}

function passengerCount(count: number): string {
  return count === 1 ? "1 passenger" : `${count} passengers`;
}

export function describeReconciliation({ added, noShows }: ManifestReconciliation): string {
  if (added > 0 && noShows > 0) {
    return `Manifest reconciled: ${passengerCount(added)} added, ${noShows} recorded as ${noShows === 1 ? "a no-show" : "no-shows"}.`;
  }

  if (added > 0) {
    return `Manifest reconciled: ${passengerCount(added)} added to free seats.`;
  }

  return `Manifest reconciled: ${passengerCount(noShows)} recorded as ${noShows === 1 ? "a no-show" : "no-shows"}.`;
}
