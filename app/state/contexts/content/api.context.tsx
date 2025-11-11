import { RotationService } from "~/state/api/rotation.service";
import { AircraftService } from "~/state/api/aircraft.service";
import { UserService } from "~/state/api/user.service";
import { FlightService } from "~/state/api/flight.service";
import { AirportService } from "~/state/api/airport.service";
import { OperatorService } from "~/state/api/operator.service";
import { SkyLinkService } from "~/state/api/skylink.service";
import React, { createContext, useContext, useMemo } from "react";
import { AuthService } from "~/state/api/auth.service";

type ApiServices = {
  rotationService: RotationService;
  aircraftService: AircraftService;
  operatorService: OperatorService;
  airportService: AirportService;
  flightService: FlightService;
  userService: UserService;
  skyLinkService: SkyLinkService;
  authService: AuthService;
};

type ApiProviderProps = {
  children: React.ReactNode;
};

const ApiContext = createContext<ApiServices | null>(null);

export function ApiProvider({ children }: ApiProviderProps) {
  const services = useMemo<ApiServices>(
    () => ({
      rotationService: new RotationService(),
      aircraftService: new AircraftService(),
      operatorService: new OperatorService(),
      airportService: new AirportService(),
      flightService: new FlightService(),
      userService: new UserService(),
      skyLinkService: new SkyLinkService(),
      authService: new AuthService(),
    }),
    [],
  );

  return <ApiContext.Provider value={services}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) throw new Error("useApi must be used within a ApiProvider");
  return context;
}
