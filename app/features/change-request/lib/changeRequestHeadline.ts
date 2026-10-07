import { type ChangeRequest, ChangeRequestResource } from "~/features/change-request/model";
import { toHuman } from "~/i18n/translate";

export type ChangeRequestHeadline = {
  noun: string;
  label: string | null;
  isCode: boolean;
};

export function changeRequestHeadline(request: ChangeRequest): ChangeRequestHeadline {
  const noun = toHuman.changeRequest.resource(request.resource);
  const isAirport = request.resource === ChangeRequestResource.Airport;

  return {
    noun,
    label: request.target?.label ?? null,
    isCode: !isAirport,
  };
}

export function describeChangeRequestTarget(request: ChangeRequest): string {
  const { noun, label } = changeRequestHeadline(request);

  if (request.target === null || label === null) {
    return `Deleted ${noun.toLowerCase()}`;
  }
  if (request.resource === ChangeRequestResource.Airport) {
    return label;
  }
  return `${noun} ${label} at ${request.target.airport.iataCode}`;
}
