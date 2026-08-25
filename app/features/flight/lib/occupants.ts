import { FlightServiceType } from "~/features/flight/model";

export function occupantsLabel(serviceType: FlightServiceType): string {
  return serviceType === FlightServiceType.Cargo ? "Supernumeraries" : "Passengers";
}
