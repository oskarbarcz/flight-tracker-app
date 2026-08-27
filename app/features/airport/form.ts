import { Continent, DataQuality } from "~/features/airport/model";
import type { Coordinates } from "~/shared/models/coordinates";

export type CreateAirportFormData = {
  icaoCode: string;
  iataCode: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  continent: Continent;
  dataQuality: DataQuality;
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
    dataQuality: DataQuality.Low,
    latitude: 0,
    longitude: 0,
    shape: null,
  };
}

export const dataQualityOptions = [
  { label: "Low", value: DataQuality.Low },
  { label: "High", value: DataQuality.High },
  { label: "Flagship", value: DataQuality.Flagship },
];
