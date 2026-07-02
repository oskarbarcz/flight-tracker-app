import type { FlightPathElement } from "~/features/flight";
import { AbstractApiService } from "~/shared/api/api.service";
import { getAdsbApiHost } from "~/shared/lib/getFlightTrackerApiHost";

export class AdsbService extends AbstractApiService {
  constructor() {
    super();
    this.host = getAdsbApiHost();
  }

  async getRecordsByCallsign(callsign: string) {
    const trimmedCallsign = callsign.replace(/\s/g, "").toUpperCase();
    const path = await this.request<FlightPathElement[]>(`/api/v1/position/${trimmedCallsign}`);

    return path.filter((entry) => !(entry.latitude === 0 && entry.longitude === 0));
  }
}
