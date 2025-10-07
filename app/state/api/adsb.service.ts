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

    return [
      {
        callsign: "AAL4913",
        date: "2025-01-01T13:10:00.000Z",
        latitude: 60.317255208578054,
        longitude: 24.958945837172326,
      },
      {
        callsign: "AAL4913",
        date: "2025-01-01T13:40:00.000Z",
        latitude: 58.68825909518984,
        longitude: 22.248460174236897,
      },
      {
        callsign: "AAL4913",
        date: "2025-01-01T14:10:00.000Z",
        latitude: 55.587475442504896,
        longitude: 17.204921862764106,
      },
      {
        callsign: "AAL4913",
        date: "2025-01-01T14:40:00.000Z",
        latitude: 54.37998045994538,
        longitude: 18.46850453127673,
      },
    ];

    return path.filter(
      (entry) => !(entry.latitude === 0 && entry.longitude === 0),
    );
  }
}
