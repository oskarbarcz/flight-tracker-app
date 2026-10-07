import { ChangeRequestResource, ChangeRequestStatus } from "~/features/change-request/model";

export function translateChangeRequestResource(resource: ChangeRequestResource): string {
  switch (resource) {
    case ChangeRequestResource.Airport:
      return "Airport";
    case ChangeRequestResource.ParkingPosition:
      return "Stand";
    case ChangeRequestResource.Gate:
      return "Gate";
    case ChangeRequestResource.Terminal:
      return "Terminal";
    case ChangeRequestResource.Runway:
      return "Runway";
  }
}

export function translateChangeRequestStatus(status: ChangeRequestStatus): string {
  switch (status) {
    case ChangeRequestStatus.Pending:
      return "Pending";
    case ChangeRequestStatus.Accepted:
      return "Accepted";
    case ChangeRequestStatus.Rejected:
      return "Rejected";
    case ChangeRequestStatus.Withdrawn:
      return "Withdrawn";
  }
}
