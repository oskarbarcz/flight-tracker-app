import React, { createContext, useContext, useMemo } from "react";
import { AircraftService } from "~/features/aircraft/service";
import { AirframeService } from "~/features/airframe/service";
import { AirportService } from "~/features/airport/service";
import { AuthService } from "~/features/auth/service";
import { DelayService } from "~/features/delay/service";
import { DiversionService } from "~/features/diversion/service";
import { EmergencyService } from "~/features/emergency/service";
import { FlightService } from "~/features/flight/service";
import { GateService } from "~/features/gate/service";
import { OperatorService } from "~/features/operator/service";
import { ParkingPositionService } from "~/features/parking-position/service";
import { RunwayService } from "~/features/runway/service";
import { SkyLinkService } from "~/features/skylink/service";
import { TerminalService } from "~/features/terminal/service";
import { TravelService } from "~/features/travel/service";
import { UserService } from "~/features/user/service";

type ApiServices = {
  aircraftService: AircraftService;
  airframeService: AirframeService;
  operatorService: OperatorService;
  airportService: AirportService;
  runwayService: RunwayService;
  terminalService: TerminalService;
  parkingPositionService: ParkingPositionService;
  gateService: GateService;
  flightService: FlightService;
  emergencyService: EmergencyService;
  diversionService: DiversionService;
  delayService: DelayService;
  travelService: TravelService;
  userService: UserService;
  skyLinkService: SkyLinkService;
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
      operatorService: new OperatorService(),
      airportService: new AirportService(),
      runwayService: new RunwayService(),
      terminalService: new TerminalService(),
      parkingPositionService: new ParkingPositionService(),
      gateService: new GateService(),
      flightService: new FlightService(),
      emergencyService: new EmergencyService(),
      diversionService: new DiversionService(),
      delayService: new DelayService(),
      travelService: new TravelService(),
      userService: new UserService(),
      skyLinkService: new SkyLinkService(),
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
