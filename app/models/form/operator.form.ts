import { Continent } from "~/models/airport.model";
import { type Operator, OperatorType } from "~/models/operator.model";
import type { CreateOperatorRequest } from "~/state/api/request/operator.request";

export type CreateOperatorFormData = {
  icaoCode: string;
  iataCode: string;
  shortName: string;
  fullName: string;
  callsign: string;
  avgFleetAge: number;
  logoUrl: string;
  backgroundUrl: string;
  type: OperatorType;
  continent: Continent;
  hubs: string;
};

export const continentOptions = [
  { label: "Europe", value: Continent.Europe },
  { label: "North America", value: Continent.NorthAmerica },
  { label: "South America", value: Continent.SouthAmerica },
  { label: "Oceania", value: Continent.Oceania },
  { label: "Asia", value: Continent.Asia },
  { label: "Africa", value: Continent.Africa },
];

export const operatorTypeOptions = [
  { label: "Legacy", value: OperatorType.Legacy },
  { label: "Charter", value: OperatorType.Charter },
  { label: "Low-cost", value: OperatorType.LowCost },
  { label: "Government / military", value: OperatorType.GovernmentMilitary },
];

export function initCreateOperatorData(): CreateOperatorFormData {
  return {
    icaoCode: "",
    iataCode: "",
    shortName: "",
    fullName: "",
    callsign: "",
    avgFleetAge: 5,
    logoUrl: "",
    backgroundUrl: "",
    type: OperatorType.Legacy,
    continent: Continent.Europe,
    hubs: "",
  };
}

export function operatorToFormData(operator: Operator): CreateOperatorFormData {
  return {
    icaoCode: operator.icaoCode,
    iataCode: operator.iataCode,
    shortName: operator.shortName,
    fullName: operator.fullName,
    callsign: operator.callsign,
    avgFleetAge: operator.avgFleetAge,
    logoUrl: operator.logoUrl ?? "",
    backgroundUrl: operator.backgroundUrl ?? "",
    type: operator.type,
    continent: operator.continent,
    hubs: operator.hubs.join(", "),
  };
}

export function operatorFormDataToRequest(values: CreateOperatorFormData): CreateOperatorRequest {
  return {
    icaoCode: values.icaoCode.trim().toUpperCase(),
    iataCode: values.iataCode.trim().toUpperCase(),
    shortName: values.shortName.trim(),
    fullName: values.fullName.trim(),
    callsign: values.callsign.trim(),
    avgFleetAge: Number(values.avgFleetAge),
    logoUrl: values.logoUrl.trim() === "" ? null : values.logoUrl.trim(),
    backgroundUrl: values.backgroundUrl.trim() === "" ? null : values.backgroundUrl.trim(),
    type: values.type,
    continent: values.continent,
    hubs: values.hubs
      .split(",")
      .map((code) => code.trim().toUpperCase())
      .filter((code) => code.length > 0),
  };
}
