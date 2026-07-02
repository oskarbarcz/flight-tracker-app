import type { Coordinates } from "~/features/runway/model";

export type Terminal = {
  id: string;
  airportId: string;
  shortName: string;
  fullName: string;
  averageTaxiTime: number;
  operatorCodes: string[];
  text: string | null;
  shape: Coordinates[] | null;
};
