import { DelayRequest } from "~/models/delay.model";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";
import type { ApiDelayRequestResponse, ReportDelayRequest } from "~/state/api/request/delay.request";

export class DelayService extends AbstractAuthorizedApiService {
  async getByFlight(flightId: string): Promise<DelayRequest | null> {
    try {
      const response = await this.fetchWithAuth<ApiDelayRequestResponse>(`/api/v1/flight/${flightId}/delay`);
      return new DelayRequest(response);
    } catch (error) {
      // No delay request exists for this flight (no qualifying delay).
      if ((error as { statusCode?: number } | undefined)?.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async fileReport(flightId: string, body: ReportDelayRequest): Promise<DelayRequest> {
    const response = await this.fetchWithAuth<ApiDelayRequestResponse>(`/api/v1/flight/${flightId}/delay`, {
      body: JSON.stringify(body),
      method: "POST",
    });
    return new DelayRequest(response);
  }

  async removeReport(flightId: string, reportId: string): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${flightId}/delay/${reportId}`, {
      method: "DELETE",
    });
  }
}
