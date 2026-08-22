import type { ErrorResponse } from "~/shared/api/api.service";

function asResponse(error: unknown): ErrorResponse<unknown> | undefined {
  return error as ErrorResponse<unknown> | undefined;
}

export function describeOsmPullFailure(error: unknown, icaoCode: string): string {
  const response = asResponse(error);

  switch (response?.statusCode) {
    case 403:
      return "Reading OpenStreetMap for an airport is limited to operations.";
    case 404:
      return `OpenStreetMap holds no aerodrome under ${icaoCode}.`;
    case 502:
      return "OpenStreetMap could not be reached. Try again in a moment.";
    default:
      return response?.message ?? "OpenStreetMap could not be read.";
  }
}

export function describeOsmPushFailure(error: unknown): string {
  const response = asResponse(error);

  switch (response?.statusCode) {
    case 403:
      return "Applying OpenStreetMap changes is limited to operations.";
    case 409:
      return "The pull held for this airport has expired. Pull the data again before applying.";
    default:
      return response?.message ?? "The selected changes could not be applied.";
  }
}
