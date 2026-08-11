import type { Coordinates } from "~/shared/models/coordinates";

export type CreateTerminalFormData = {
  shortName: string;
  fullName: string;
  averageTaxiTime: string;
  operatorCodes: string;
  text: string;
  shape: Coordinates[] | null;
};

export function initCreateTerminalData(): CreateTerminalFormData {
  return {
    shortName: "",
    fullName: "",
    averageTaxiTime: "",
    operatorCodes: "",
    text: "",
    shape: null,
  };
}
