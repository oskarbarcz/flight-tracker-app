import { Operator } from "~/models/operator.model";

export type Aircraft = {
  id: string;
  icaoCode: string;
  shortName: string;
  fullName: string;
  registration: string;
  selcal: string;
  livery: string;
  operatorId: string;
  operator: Operator;
};

export type CreateAircraftDto = Omit<Aircraft, "id" | "operator">;
export type EditAircraftDto = CreateAircraftDto;
