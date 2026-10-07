import type {
  ApiChangedField,
  ApiChangeRequestParticipant,
  ApiChangeRequestResponse,
  ApiChangeRequestTarget,
  ApiChangeRequestWithFieldsResponse,
} from "~/features/change-request/request";
import { UserRole } from "~/features/user/model";

export enum ChangeRequestResource {
  Airport = "airport",
  ParkingPosition = "parkingPosition",
  Gate = "gate",
  Terminal = "terminal",
  Runway = "runway",
}

export enum ChangeRequestStatus {
  Pending = "pending",
  Accepted = "accepted",
  Rejected = "rejected",
  Withdrawn = "withdrawn",
}

export const CHANGE_REQUEST_REVIEWERS: UserRole[] = [UserRole.Operations, UserRole.Admin];

export const CHANGE_REQUEST_RESOURCES: ChangeRequestResource[] = [
  ChangeRequestResource.Airport,
  ChangeRequestResource.ParkingPosition,
  ChangeRequestResource.Gate,
  ChangeRequestResource.Terminal,
  ChangeRequestResource.Runway,
];

export type ChangeRequestParticipant = ApiChangeRequestParticipant;

export type ChangeRequestTarget = ApiChangeRequestTarget;

export type ChangedField = ApiChangedField;

export class ChangeRequest {
  readonly id: string;
  readonly resource: ChangeRequestResource;
  readonly targetId: string;
  readonly changedFieldNames: string[];
  readonly status: ChangeRequestStatus;
  readonly requestedBy: ChangeRequestParticipant;
  readonly decidedBy: ChangeRequestParticipant | null;
  readonly rejectionReason: string | null;
  readonly decidedAt: Date | null;
  readonly createdAt: Date;
  readonly target: ChangeRequestTarget | null;

  constructor(response: ApiChangeRequestResponse) {
    this.id = response.id;
    this.resource = response.resource;
    this.targetId = response.targetId;
    this.changedFieldNames = Object.keys(response.changes);
    this.status = response.status;
    this.requestedBy = response.requestedBy;
    this.decidedBy = response.decidedBy;
    this.rejectionReason = response.rejectionReason;
    this.decidedAt = response.decidedAt === null ? null : new Date(response.decidedAt);
    this.createdAt = new Date(response.createdAt);
    this.target = response.target;
  }

  get isPending(): boolean {
    return this.status === ChangeRequestStatus.Pending;
  }

  get isTargetGone(): boolean {
    return this.target === null;
  }

  targets(other: ChangeRequest): boolean {
    return this.resource === other.resource && this.targetId === other.targetId;
  }
}

export class ChangeRequestDetail extends ChangeRequest {
  readonly fields: ChangedField[];

  constructor(response: ApiChangeRequestWithFieldsResponse) {
    super(response);
    this.fields = response.fields;
  }
}
