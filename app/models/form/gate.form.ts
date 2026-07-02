import { GateCategory } from "~/models/gate.model";

export type CreateGateFormData = {
  terminalId: string;
  name: string;
  category: GateCategory;
  parkingPositionId: string;
};

export function initCreateGateData(terminalId = ""): CreateGateFormData {
  return {
    terminalId,
    name: "",
    category: GateCategory.Schengen,
    parkingPositionId: "",
  };
}
