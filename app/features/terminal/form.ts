import type { Coordinates } from "~/shared/models/coordinates";

export type CreateTerminalFormData = {
  shortName: string;
  fullName: string;
  averageTaxiTime: number;
  operatorCodes: string;
  text: string;
  shape: Coordinates[] | null;
};

export function initCreateTerminalData(): CreateTerminalFormData {
  return {
    shortName: "",
    fullName: "",
    averageTaxiTime: 0,
    operatorCodes: "",
    text: "",
    shape: null,
  };
}
