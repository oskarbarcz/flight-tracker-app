import { getAdsbApiHost } from "~/functions/getFlightTrackerApiHost";
import { FlightPathElement } from "~/models";
import { AbstractApiService } from "~/state/api/api.service";

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

  async isFlightTracked(callsign: string): Promise<boolean> {
    const records = await this.getRecordsByCallsign(callsign);

    return records.length > 0;
  }
}
