import { Alliance, type Operator, OperatorType } from "~/features/operator/model";
import type { CreateOperatorRequest } from "~/features/operator/request";
import { Continent } from "~/models/airport.model";

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

export const allianceOptions = [
  { label: "Star Alliance", value: Alliance.StarAlliance },
  { label: "SkyTeam", value: Alliance.SkyTeam },
  { label: "Oneworld", value: Alliance.Oneworld },
  { label: "Vanilla Alliance", value: Alliance.VanillaAlliance },
];

export function allianceLabel(alliance: Alliance | null | undefined): string | null {
  return allianceOptions.find((option) => option.value === alliance)?.label ?? null;
}

export function continentLabel(continent: Continent): string {
  return continentOptions.find((option) => option.value === continent)?.label ?? continent;
}

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
