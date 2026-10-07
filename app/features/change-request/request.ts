import type { ChangeRequestResource, ChangeRequestStatus } from "~/features/change-request/model";

export type ApiChangeRequestParticipant = {
  id: string;
  name: string;
};

export type ApiChangeRequestTargetAirport = {
  id: string;
  icaoCode: string;
  iataCode: string;
  name: string;
};

export type ApiChangeRequestTarget = {
  label: string;
  airport: ApiChangeRequestTargetAirport;
};

export type ApiChangeRequestResponse = {
  id: string;
  resource: ChangeRequestResource;
  targetId: string;
  changes: Record<string, unknown>;
  status: ChangeRequestStatus;
  requestedBy: ApiChangeRequestParticipant;
  decidedBy: ApiChangeRequestParticipant | null;
  rejectionReason: string | null;
  decidedAt: string | null;
  createdAt: string;
  target: ApiChangeRequestTarget | null;
};

export type ApiChangedField = {
  field: string;
  current: unknown;
  proposed: unknown;
  currentLabel?: string | null;
  proposedLabel?: string | null;
};

export type ApiChangeRequestWithFieldsResponse = ApiChangeRequestResponse & {
  fields: ApiChangedField[];
};

export type ChangeRequestListFilters = {
  status?: ChangeRequestStatus;
  resource?: ChangeRequestResource;
};

export type RejectChangeRequestRequest = {
  rejectionReason: string;
};
