import React, { createContext, useContext, useMemo } from "react";
import { AircraftService } from "~/state/api/aircraft.service";
import { AirframeService } from "~/state/api/airframe.service";
import { AirportService } from "~/state/api/airport.service";
import { AuthService } from "~/state/api/auth.service";
import { DiversionService } from "~/state/api/diversion.service";
import { EmergencyService } from "~/state/api/emergency.service";
import { FlightService } from "~/state/api/flight.service";
import { GateService } from "~/state/api/gate.service";
import { OperatorService } from "~/state/api/operator.service";
import { RotationService } from "~/state/api/rotation.service";
import { RunwayService } from "~/state/api/runway.service";
import { SkyLinkService } from "~/state/api/skylink.service";
import { TerminalService } from "~/state/api/terminal.service";
import { UserService } from "~/state/api/user.service";

type ApiServices = {
  rotationService: RotationService;
  aircraftService: AircraftService;
  airframeService: AirframeService;
  operatorService: OperatorService;
  airportService: AirportService;
  runwayService: RunwayService;
  terminalService: TerminalService;
  gateService: GateService;
  flightService: FlightService;
  emergencyService: EmergencyService;
  diversionService: DiversionService;
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
      airframeService: new AirframeService(),
      operatorService: new OperatorService(),
      airportService: new AirportService(),
      runwayService: new RunwayService(),
      terminalService: new TerminalService(),
      gateService: new GateService(),
      flightService: new FlightService(),
      emergencyService: new EmergencyService(),
      diversionService: new DiversionService(),
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
