import { Continent } from "~/models";

export type CreateAirportFormData = {
  isGeneralSubmitted: boolean;
  isLocationSubmitted: boolean;
  general: {
    icaoCode: string;
    iataCode: string;
    name: string;
  };
  location: {
    city: string;
    country: string;
    timezone: string;
    continent: Continent;
    latitude: number;
    longitude: number;
  };
};

export function initCreateAirportData(): CreateAirportFormData {
  return {
    isGeneralSubmitted: false,
    isLocationSubmitted: false,
    general: {
      icaoCode: "",
      iataCode: "",
      name: "",
    },
    location: {
      city: "",
      country: "",
      timezone: "",
      continent: Continent.Europe,
      latitude: 0,
      longitude: 0,
    },
  };
}
