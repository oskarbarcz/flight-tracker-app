import { useEffect, useState } from "react";
import type { ParkingPosition } from "~/features/parking-position";
import type { Runway } from "~/features/runway";
import type { Terminal } from "~/features/terminal";
import { useApi } from "~/shared/api/useApi";

export type AirportLayout = {
  runways: Runway[];
  terminals: Terminal[];
  stand: ParkingPosition | null;
  standTerminal: Terminal | null;
};

export function useAirportLayout(airportId: string | null, standId: string | null): AirportLayout {
  const { runwayService, terminalService, parkingPositionService } = useApi();
  const [runways, setRunways] = useState<Runway[]>([]);
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [stand, setStand] = useState<ParkingPosition | null>(null);

  useEffect(() => {
    setRunways([]);
    setTerminals([]);
    if (!airportId) return;

    let cancelled = false;
    runwayService
      .fetchAll(airportId)
      .then((result) => !cancelled && setRunways(result))
      .catch((err) => console.error("Cannot fetch the airport runways", err));
    terminalService
      .fetchAll(airportId)
      .then((result) => !cancelled && setTerminals(result))
      .catch((err) => console.error("Cannot fetch the airport terminals", err));

    return () => {
      cancelled = true;
    };
  }, [runwayService, terminalService, airportId]);

  useEffect(() => {
    setStand(null);
    if (!airportId || !standId) return;

    let cancelled = false;
    parkingPositionService
      .fetchById(airportId, standId)
      .then((result) => !cancelled && setStand(result))
      .catch((err) => console.error("Cannot fetch the parking position", err));

    return () => {
      cancelled = true;
    };
  }, [parkingPositionService, airportId, standId]);

  const standTerminal = stand ? (terminals.find((terminal) => terminal.id === stand.terminalId) ?? null) : null;

  return { runways, terminals, stand, standTerminal };
}
