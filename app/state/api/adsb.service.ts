import { FlightPathElement } from "~/models";
import { AbstractApiService } from "~/state/api/api.service";
import { getAdsbApiHost } from "~/functions/getFlightTrackerApiHost";

export class AdsbService extends AbstractApiService {
  constructor() {
    super();
    this.host = getAdsbApiHost();
  }

  async getRecordsByCallsign(callsign: string): Promise<FlightPathElement[]> {
    const trimmedCallsign = callsign.replace(/\s/g, "").toUpperCase();
    const path = await this.request<FlightPathElement[]>(
      `/api/v1/position/${trimmedCallsign}`,
    );

    return path.filter(
      (entry) => !(entry.latitude === 0 && entry.longitude === 0),
    );
  }
}
