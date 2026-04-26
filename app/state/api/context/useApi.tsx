import React, { createContext, useContext, useMemo } from "react";
import { AircraftService } from "~/state/api/aircraft.service";
import { AirportService } from "~/state/api/airport.service";
import { AuthService } from "~/state/api/auth.service";
import { FlightService } from "~/state/api/flight.service";
import { OperatorService } from "~/state/api/operator.service";
import { RotationService } from "~/state/api/rotation.service";
import { RunwayService } from "~/state/api/runway.service";
import { SkyLinkService } from "~/state/api/skylink.service";
import { TerminalService } from "~/state/api/terminal.service";
import { UserService } from "~/state/api/user.service";

type ApiServices = {
  rotationService: RotationService;
  aircraftService: AircraftService;
  operatorService: OperatorService;
  airportService: AirportService;
  runwayService: RunwayService;
  terminalService: TerminalService;
  flightService: FlightService;
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
      rotationService: new RotationService(),
      aircraftService: new AircraftService(),
      operatorService: new OperatorService(),
      airportService: new AirportService(),
      runwayService: new RunwayService(),
      terminalService: new TerminalService(),
      flightService: new FlightService(),
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
