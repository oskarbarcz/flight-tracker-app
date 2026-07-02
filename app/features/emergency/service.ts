import { Emergency } from "~/features/emergency/model";
import type {
  ApiEmergencyResponse,
  DeclareEmergencyRequest,
  UpdateEmergencyRequest,
} from "~/features/emergency/request";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

export class EmergencyService extends AbstractAuthorizedApiService {
  async listByFlight(flightId: string): Promise<Emergency[]> {
    const response = await this.fetchWithAuth<ApiEmergencyResponse[]>(`/api/v1/flight/${flightId}/emergency`);
    return response.map((entry) => new Emergency(entry));
  }

  async declare(flightId: string, body: DeclareEmergencyRequest): Promise<Emergency> {
    const response = await this.fetchWithAuth<ApiEmergencyResponse>(`/api/v1/flight/${flightId}/emergency`, {
      body: JSON.stringify(body),
      method: "POST",
    });
    return new Emergency(response);
  }

  async update(flightId: string, emergencyId: string, body: UpdateEmergencyRequest): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${flightId}/emergency/${emergencyId}`, {
      body: JSON.stringify(body),
      method: "PATCH",
    });
  }

  async resolve(flightId: string, emergencyId: string): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${flightId}/emergency/${emergencyId}`, {
      method: "DELETE",
    });
  }
}
