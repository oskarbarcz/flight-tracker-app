import { AbstractApiService } from "~/state/api/api.service";
import {
  CreateRotationRequest,
  EditRotationRequest,
  RotationResponse,
} from "~/models";

export class RotationService extends AbstractApiService {
  async getAll(): Promise<RotationResponse[]> {
    return this.requestWithAuth<RotationResponse[]>("/api/v1/rotation");
  }

  async createNew(rotation: CreateRotationRequest): Promise<RotationResponse> {
    return this.requestWithAuth<RotationResponse>("/api/v1/rotation", {
      body: JSON.stringify(rotation),
      method: "POST",
    });
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
