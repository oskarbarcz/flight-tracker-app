import React, { createContext, useContext, useMemo } from "react";
import { AircraftService } from "~/features/aircraft/service";
import { AirframeService } from "~/features/airframe/service";
import { AirportService } from "~/features/airport/service";
import { AuthService } from "~/features/auth/service";
import { CabinLayoutService } from "~/features/cabin-layout/service";
import { CargoHoldService } from "~/features/cargo-hold/service";
import { CargoManifestService } from "~/features/cargo-manifest/service";
import { DelayService } from "~/features/delay/service";
import { DiversionService } from "~/features/diversion/service";
import { EmergencyService } from "~/features/emergency/service";
import { FlightService } from "~/features/flight/service";
import { GateService } from "~/features/gate/service";
import { NotocService } from "~/features/notoc/service";
import { OperatorService } from "~/features/operator/service";
import { ParkingPositionService } from "~/features/parking-position/service";
import { RotationService } from "~/features/rotation/service";
import { RunwayService } from "~/features/runway/service";
import { SkyLinkService } from "~/features/skylink/service";
import { StatsService } from "~/features/stats/service";
import { TerminalService } from "~/features/terminal/service";
import { TravelService } from "~/features/travel/service";
import { UserService } from "~/features/user/service";

type ApiServices = {
  aircraftService: AircraftService;
  airframeService: AirframeService;
  cabinLayoutService: CabinLayoutService;
  cargoHoldService: CargoHoldService;
  cargoManifestService: CargoManifestService;
  notocService: NotocService;
  operatorService: OperatorService;
  airportService: AirportService;
  runwayService: RunwayService;
  terminalService: TerminalService;
  parkingPositionService: ParkingPositionService;
  gateService: GateService;
  flightService: FlightService;
  rotationService: RotationService;
  emergencyService: EmergencyService;
  diversionService: DiversionService;
  delayService: DelayService;
  travelService: TravelService;
  userService: UserService;
  skyLinkService: SkyLinkService;
  statsService: StatsService;
  authService: AuthService;
};

type ApiProviderProps = {
  children: React.ReactNode;
};

const UseApi = createContext<ApiServices | null>(null);

export function ApiProvider({ children }: ApiProviderProps) {
  const services = useMemo<ApiServices>(
    () => ({
      aircraftService: new AircraftService(),
      airframeService: new AirframeService(),
      cabinLayoutService: new CabinLayoutService(),
      cargoHoldService: new CargoHoldService(),
      cargoManifestService: new CargoManifestService(),
      notocService: new NotocService(),
      operatorService: new OperatorService(),
      airportService: new AirportService(),
      runwayService: new RunwayService(),
      terminalService: new TerminalService(),
      parkingPositionService: new ParkingPositionService(),
      gateService: new GateService(),
      flightService: new FlightService(),
      rotationService: new RotationService(),
      emergencyService: new EmergencyService(),
      diversionService: new DiversionService(),
      delayService: new DelayService(),
      travelService: new TravelService(),
      userService: new UserService(),
      skyLinkService: new SkyLinkService(),
      statsService: new StatsService(),
      authService: new AuthService(),
    }),
    [],
  );

  return <UseApi.Provider value={services}>{children}</UseApi.Provider>;
}

export function useApi() {
  const context = useContext(UseApi);
  if (!context) throw new Error("useApi must be used within a ApiProvider");
  return context;
}
