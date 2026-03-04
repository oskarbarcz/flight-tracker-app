import {
  CreateRotationRequest,
  EditRotationRequest,
  RotationResponse,
} from "~/models";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";

export class RotationService extends AbstractAuthorizedApiService {
  async fetchAll(operatorId: string): Promise<RotationResponse[]> {
    return this.requestWithAuth<RotationResponse[]>(
      `/api/v1/operator/${operatorId}/rotation`,
    );
  }

  async create(
    operatorId: string,
    data: CreateRotationRequest,
  ): Promise<RotationResponse> {
    return this.requestWithAuth<RotationResponse>(
      `/api/v1/operator/${operatorId}/rotation`,
      {
        body: JSON.stringify(data),
        method: "POST",
      },
    );
  }

  async getById(id: string): Promise<RotationResponse> {
    return this.requestWithAuth<RotationResponse>(`/api/v1/rotation/${id}`);
  }

  async update(
    id: string,
    rotation: EditRotationRequest,
  ): Promise<RotationResponse> {
    return this.requestWithAuth<RotationResponse>(`/api/v1/rotation/${id}`, {
      body: JSON.stringify(rotation),
      method: "PATCH",
    });
  }

  async remove(id: string): Promise<void> {
    await this.requestWithAuth<RotationResponse>(`/api/v1/rotation/${id}`, {
      method: "DELETE",
    });
  }

  async addFlight(rotationId: string, flightId: string): Promise<void> {
    await this.requestWithAuth<RotationResponse>(
      `/api/v1/rotation/${rotationId}/flight/${flightId}`,
      {
        method: "POST",
      },
    );
  }

  async removeFlight(rotationId: string, flightId: string): Promise<void> {
    await this.requestWithAuth<RotationResponse>(
      `/api/v1/rotation/${rotationId}/flight/${flightId}`,
      {
        method: "DELETE",
      },
    );
  }
}
