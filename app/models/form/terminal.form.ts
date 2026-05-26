import type { Coordinates } from "~/models/runway.model";

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
