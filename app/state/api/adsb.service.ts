import { FlightPathElement } from "~/models";
import { AbstractApiService } from "~/state/api/api.service";
import { getAdsbApiHost } from "~/functions/getFlightTrackerApiHost";

export class AdsbService extends AbstractApiService {
  constructor() {
    super();
    this.host = getAdsbApiHost();
  }

  async getByCallsign(callsign: string): Promise<FlightPathElement[]> {
    return this.request<FlightPathElement[]>(`/api/v1/position/${callsign}`);
  }
}
