import { Diversion } from "~/models/diversion.model";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";
import type {
  ApiDiversionResponse,
  ReportDiversionRequest,
  UpdateDiversionRequest,
} from "~/state/api/request/diversion.request";

export class DiversionService extends AbstractAuthorizedApiService {
  async getByFlight(flightId: string): Promise<Diversion> {
    const response = await this.fetchWithAuth<ApiDiversionResponse>(`/api/v1/flight/${flightId}/diversion`);
    return new Diversion(response);
  }

  async report(flightId: string, body: ReportDiversionRequest): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${flightId}/diversion`, {
      body: JSON.stringify(body),
      method: "POST",
    });
  }

  async update(flightId: string, body: UpdateDiversionRequest): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${flightId}/diversion`, {
      body: JSON.stringify(body),
      method: "PATCH",
    });
  }
}
