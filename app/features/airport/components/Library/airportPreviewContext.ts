import { useOutletContext } from "react-router";
import type { Airport } from "~/features/airport";
import type { Gate } from "~/features/gate";
import type { ParkingPosition } from "~/features/parking-position";
import type { Runway } from "~/features/runway";
import type { Terminal } from "~/features/terminal";

export type AirportPreviewContext = {
  airport: Airport;
  runways: Runway[];
  terminals: Terminal[];
  parkingPositions: ParkingPosition[];
  gates: Gate[];
};

export function useAirportPreview(): AirportPreviewContext {
  return useOutletContext<AirportPreviewContext>();
}
