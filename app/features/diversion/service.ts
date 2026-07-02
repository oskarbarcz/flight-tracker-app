import { Diversion } from "~/features/diversion/model";
import type {
  ApiDiversionResponse,
  ReportDiversionRequest,
  UpdateDiversionRequest,
} from "~/features/diversion/request";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

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
