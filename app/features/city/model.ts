import type { CountryRef } from "~/features/country/model";

export type CityRef = {
  id: string;
  name: string;
};

export type City = CityRef & {
  country: CountryRef;
  hasPostcard: boolean;
};
