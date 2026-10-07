import { translateContinent } from "~/features/airport/i18n";
import type { Continent } from "~/features/airport/model";
import { type ChangedField, ChangeRequestResource } from "~/features/change-request/model";
import { gateCategoryOptions } from "~/features/gate/model";
import {
  bridgeOptions,
  deicingOptions,
  fuelingOptionsList,
  gateLocationOptions,
  groundUnitOptions,
  noiseSensitivityOptions,
  parkingAssistanceOptions,
  parkingPositionTypeOptions,
  parkingSpotTypeOptions,
  stairsOptions,
} from "~/features/parking-position/model";
import { lightingTypeOptions, surfaceTypeOptions } from "~/features/runway/model";
import { buildEnumLookup } from "~/shared/lib/buildEnumLookup";

export type FieldValueFormat =
  | "text"
  | "prose"
  | "code"
  | "codes"
  | "number"
  | "time"
  | "country"
  | "point"
  | "polygon";

export type ChangeRequestFieldSpec = {
  label: string;
  format: FieldValueFormat;
  unit?: string;
  translate?: (value: string) => string;
  isReference?: boolean;
};

function optionLabel(options: { value: string; label: string }[]): (value: string) => string {
  return buildEnumLookup<string>(options);
}

const FIELD_SPECS: Record<ChangeRequestResource, Record<string, ChangeRequestFieldSpec>> = {
  [ChangeRequestResource.Airport]: {
    name: { label: "Name", format: "text" },
    continent: {
      label: "Continent",
      format: "text",
      translate: (value) => translateContinent(value as Continent),
    },
    country: { label: "Country", format: "country" },
    timezone: { label: "Timezone", format: "code" },
    cityId: { label: "City", format: "text", isReference: true },
    location: { label: "Coordinates", format: "point" },
    shape: { label: "Boundary", format: "polygon" },
  },
  [ChangeRequestResource.ParkingPosition]: {
    name: { label: "Name", format: "code" },
    terminalId: { label: "Terminal", format: "code", isReference: true },
    bridge: { label: "Jet bridge", format: "text", translate: optionLabel(bridgeOptions) },
    stairs: { label: "Stairs boarding", format: "text", translate: optionLabel(stairsOptions) },
    deicing: { label: "Deicing", format: "text", translate: optionLabel(deicingOptions) },
    deicingDescription: { label: "Deicing notes", format: "prose" },
    gpu: { label: "GPU", format: "text", translate: optionLabel(groundUnitOptions) },
    pca: { label: "PCA", format: "text", translate: optionLabel(groundUnitOptions) },
    type: { label: "Position", format: "text", translate: optionLabel(parkingPositionTypeOptions) },
    spotType: { label: "Spot type", format: "text", translate: optionLabel(parkingSpotTypeOptions) },
    assistance: { label: "Assistance", format: "text", translate: optionLabel(parkingAssistanceOptions) },
    location: { label: "Parking location", format: "text", translate: optionLabel(gateLocationOptions) },
    noiseSensitivity: {
      label: "Noise sensitivity",
      format: "text",
      translate: optionLabel(noiseSensitivityOptions),
    },
    noiseSensitivityText: { label: "Noise restrictions notes", format: "prose" },
    noiseSensitivityStartTime: { label: "Curfew start", format: "time" },
    noiseSensitivityEndTime: { label: "Curfew end", format: "time" },
    fuelingOptions: { label: "Fueling", format: "text", translate: optionLabel(fuelingOptionsList) },
    coordinates: { label: "Location", format: "point" },
  },
  [ChangeRequestResource.Gate]: {
    name: { label: "Name", format: "code" },
    category: { label: "Category", format: "text", translate: optionLabel(gateCategoryOptions) },
    terminalId: { label: "Terminal", format: "code", isReference: true },
    parkingPositionId: { label: "Stand", format: "code", isReference: true },
    coordinates: { label: "Location", format: "point" },
  },
  [ChangeRequestResource.Terminal]: {
    shortName: { label: "Short name", format: "code" },
    fullName: { label: "Full name", format: "text" },
    averageTaxiTime: { label: "Average taxi time", format: "number", unit: "min" },
    operatorCodes: { label: "Operators", format: "codes" },
    text: { label: "Briefing notes", format: "prose" },
    shape: { label: "Footprint", format: "polygon" },
  },
  [ChangeRequestResource.Runway]: {
    designator: { label: "Designator", format: "code" },
    length: { label: "Length", format: "number", unit: "m" },
    width: { label: "Width", format: "number", unit: "m" },
    displace: { label: "Displaced threshold", format: "number", unit: "m" },
    trueHeading: { label: "True heading", format: "number", unit: "°" },
    magneticHeading: { label: "Magnetic heading", format: "number", unit: "°" },
    elevation: { label: "Elevation", format: "number", unit: "m" },
    surfaceType: { label: "Surface", format: "text", translate: optionLabel(surfaceTypeOptions) },
    lightingType: { label: "Lighting", format: "text", translate: optionLabel(lightingTypeOptions) },
    coordinates: { label: "Threshold", format: "point" },
  },
};

function humanizeFieldName(field: string): string {
  const spaced = field.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function changeRequestFieldSpec(resource: ChangeRequestResource, field: string): ChangeRequestFieldSpec {
  return FIELD_SPECS[resource][field] ?? { label: humanizeFieldName(field), format: "text" };
}

export function orderChangedFields(resource: ChangeRequestResource, fields: string[]): string[] {
  const order = Object.keys(FIELD_SPECS[resource]);
  const rank = (field: string) => {
    const index = order.indexOf(field);
    return index === -1 ? order.length : index;
  };
  return [...fields].sort((left, right) => rank(left) - rank(right));
}

export function summarizeChangedFields(resource: ChangeRequestResource, fields: string[]): string {
  return orderChangedFields(resource, fields)
    .map((field, index) => {
      const label = changeRequestFieldSpec(resource, field).label;
      return index === 0 || label === label.toUpperCase() ? label : label.toLowerCase();
    })
    .join(", ");
}

export function deletedProposedReferences(resource: ChangeRequestResource, fields: ChangedField[]): string[] {
  return fields
    .filter((field) => {
      const isReference = changeRequestFieldSpec(resource, field.field).isReference === true;
      const proposesRecord = field.proposed !== null && field.proposed !== undefined;
      return isReference && proposesRecord && !field.proposedLabel;
    })
    .map((field) => changeRequestFieldSpec(resource, field.field).label.toLowerCase());
}
