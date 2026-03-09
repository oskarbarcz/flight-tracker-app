import { AbstractAuthorizedApiService } from "~/state/api/api.service";
import type {
  CreateRotationRequest,
  EditRotationRequest,
  RotationResponse,
} from "~/state/api/request/operator.request";

export class RotationService extends AbstractAuthorizedApiService {
  async fetchAll(operatorId: string) {
    return this.fetchWithAuth<RotationResponse[]>(`/api/v1/operator/${operatorId}/rotation`);
  }

  async fetchById(id: string) {
    return this.fetchWithAuth<RotationResponse>(`/api/v1/rotation/${id}`);
  }

  async create(operatorId: string, data: CreateRotationRequest) {
    return this.fetchWithAuth<RotationResponse>(`/api/v1/operator/${operatorId}/rotation`, {
      body: JSON.stringify(data),
      method: "POST",
    });
  }

  async update(id: string, data: EditRotationRequest) {
    return this.fetchWithAuth<RotationResponse>(`/api/v1/rotation/${id}`, {
      body: JSON.stringify(data),
      method: "PATCH",
    });
  }

  async remove(id: string) {
    await this.fetchWithAuth<RotationResponse>(`/api/v1/rotation/${id}`, {
      method: "DELETE",
    });
  }

  async addFlight(rotationId: string, flightId: string) {
    await this.fetchWithAuth<RotationResponse>(`/api/v1/rotation/${rotationId}/flight/${flightId}`, {
      method: "POST",
    });
  }

  async removeFlight(rotationId: string, flightId: string) {
    await this.fetchWithAuth<RotationResponse>(`/api/v1/rotation/${rotationId}/flight/${flightId}`, {
      method: "DELETE",
    });
  }
}
