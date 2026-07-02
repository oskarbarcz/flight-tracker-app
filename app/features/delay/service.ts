import { DelayRequest } from "~/features/delay/model";
import type {
  ApiDelayRequestResponse,
  DelayRequestStatusFilter,
  RejectDelayReportRequest,
  ReportDelayRequest,
} from "~/features/delay/request";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

export class DelayService extends AbstractAuthorizedApiService {
  async getByFlight(flightId: string): Promise<DelayRequest | null> {
    try {
      const response = await this.fetchWithAuth<ApiDelayRequestResponse>(`/api/v1/flight/${flightId}/delay`);
      return new DelayRequest(response);
    } catch (error) {
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

  async list(status?: DelayRequestStatusFilter): Promise<DelayRequest[]> {
    const query = status ? `?status=${status}` : "";
    const response = await this.fetchWithAuth<ApiDelayRequestResponse[]>(`/api/v1/flight/delay${query}`);
    return response.map((delayRequest) => new DelayRequest(delayRequest));
  }

  async acceptReport(flightId: string, reportId: string): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${flightId}/delay/${reportId}/accept`, {
      method: "POST",
    });
  }

  async rejectReport(flightId: string, reportId: string, body: RejectDelayReportRequest): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${flightId}/delay/${reportId}/reject`, {
      body: JSON.stringify(body),
      method: "POST",
    });
  }
}
