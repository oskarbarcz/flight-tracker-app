import { UserTravel } from "~/models/travel.model";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";
import type { ApiUserTravelResponse, CreateTravelRequest } from "~/state/api/request/travel.request";

export class TravelService extends AbstractAuthorizedApiService {
  async listByUser(userId: string): Promise<UserTravel[]> {
    const response = await this.fetchWithAuth<ApiUserTravelResponse[]>(`/api/v1/user/${userId}/travel`);
    return response.map((travel) => new UserTravel(travel));
  }

  async requestManualTravel(userId: string, body: CreateTravelRequest): Promise<UserTravel[]> {
    const response = await this.fetchWithAuth<ApiUserTravelResponse[]>(`/api/v1/user/${userId}/travel`, {
      body: JSON.stringify(body),
      method: "POST",
    });
    return response.map((travel) => new UserTravel(travel));
  }
}
