import { Continent } from "~/models";
import type { Coordinates } from "~/models/runway.model";

export type CreateAirportFormData = {
  icaoCode: string;
  iataCode: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  continent: Continent;
  latitude: number;
  longitude: number;
  shape: Coordinates[] | null;
};

export function initCreateAirportData(): CreateAirportFormData {
  return {
    icaoCode: "",
    iataCode: "",
    name: "",
    city: "",
    country: "",
    timezone: "",
    continent: Continent.Europe,
    latitude: 0,
    longitude: 0,
    shape: null,
  };
}
