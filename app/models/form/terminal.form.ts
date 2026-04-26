export type CreateTerminalFormData = {
  shortName: string;
  fullName: string;
  averageTaxiTime: number;
  operatorCodes: string;
  text: string;
};

export function initCreateTerminalData(): CreateTerminalFormData {
  return {
    shortName: "",
    fullName: "",
    averageTaxiTime: 0,
    operatorCodes: "",
    text: "",
  };
}
