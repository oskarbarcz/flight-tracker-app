import { GateCategory } from "~/features/gate/model";
import type { Coordinates } from "~/shared/models/coordinates";

export type CreateGateFormData = {
  terminalId: string;
  name: string;
  category: GateCategory;
  parkingPositionId: string;
  coordinates: Coordinates | null;
};

export function initCreateGateData(terminalId = ""): CreateGateFormData {
  return {
    terminalId,
    name: "",
    category: GateCategory.Schengen,
    parkingPositionId: "",
    coordinates: null,
  };
}
