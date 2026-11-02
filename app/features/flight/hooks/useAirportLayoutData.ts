import { useEffect, useMemo, useState } from "react";
import type { Gate } from "~/features/gate";
import type { ParkingPosition } from "~/features/parking-position";
import type { Runway } from "~/features/runway";
import type { Terminal } from "~/features/terminal";
import { useApi } from "~/shared/api/useApi";
import { usePublicApi } from "~/shared/api/usePublicApi";

export type AirportLayoutData = {
  runways: Runway[];
  terminals: Terminal[];
  parkingPositions: ParkingPosition[];
  gates: Gate[];
};

type ListSource<T> = { fetchAll: (airportId: string) => Promise<T[]> };

export type AirportLayoutServices = {
  runways: ListSource<Runway>;
  terminals: ListSource<Terminal>;
  parkingPositions: ListSource<ParkingPosition>;
  gates: ListSource<Gate>;
};

const EMPTY_LAYOUT: AirportLayoutData = { runways: [], terminals: [], parkingPositions: [], gates: [] };

export function useAuthorizedLayoutServices(): AirportLayoutServices {
  const { runwayService, terminalService, parkingPositionService, gateService } = useApi();

  return useMemo(
    () => ({
      runways: runwayService,
      terminals: terminalService,
      parkingPositions: { fetchAll: (airportId: string) => parkingPositionService.fetchAllCached(airportId) },
      gates: gateService,
    }),
    [runwayService, terminalService, parkingPositionService, gateService],
  );
}

export function usePublicLayoutServices(): AirportLayoutServices {
  const { publicRunwayService, publicTerminalService, publicParkingPositionService, publicGateService } =
    usePublicApi();

  return useMemo(
    () => ({
      runways: publicRunwayService,
      terminals: publicTerminalService,
      parkingPositions: publicParkingPositionService,
      gates: publicGateService,
    }),
    [publicRunwayService, publicTerminalService, publicParkingPositionService, publicGateService],
  );
}

export function useAirportLayoutData(airportId: string | null, services: AirportLayoutServices): AirportLayoutData {
  const [layout, setLayout] = useState<AirportLayoutData>(EMPTY_LAYOUT);

  useEffect(() => {
    setLayout(EMPTY_LAYOUT);
    if (airportId === null) return;

    let cancelled = false;
    const settle = <T>(request: Promise<T[]>): Promise<T[]> => request.catch(() => []);

    Promise.all([
      settle(services.runways.fetchAll(airportId)),
      settle(services.terminals.fetchAll(airportId)),
      settle(services.parkingPositions.fetchAll(airportId)),
      settle(services.gates.fetchAll(airportId)),
    ]).then(([runways, terminals, parkingPositions, gates]) => {
      if (!cancelled) {
        setLayout({ runways, terminals, parkingPositions, gates });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [services, airportId]);

  return layout;
}
