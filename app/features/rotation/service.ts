import { Rotation, type RotationStatus } from "~/features/rotation/model";
import type {
  AddLegRequest,
  ApiRotationResponse,
  CreateRotationRequest,
  EditRotationRequest,
  UpdateLegRequest,
} from "~/features/rotation/request";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

export class RotationService extends AbstractAuthorizedApiService {
  async listForOperator(operatorId: string, status?: RotationStatus): Promise<Rotation[]> {
    const query = status ? `?status=${status}` : "";
    const response = await this.fetchWithAuth<ApiRotationResponse[]>(`/api/v1/operator/${operatorId}/rotation${query}`);
    return response.map((rotation) => new Rotation(rotation));
  }

  async fetchById(rotationId: string): Promise<Rotation> {
    const response = await this.fetchWithAuth<ApiRotationResponse>(`/api/v1/rotation/${rotationId}`);
    return new Rotation(response);
  }

  async create(operatorId: string, data: CreateRotationRequest): Promise<Rotation> {
    const response = await this.fetchWithAuth<ApiRotationResponse>(`/api/v1/operator/${operatorId}/rotation`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return new Rotation(response);
  }

  async update(rotationId: string, data: EditRotationRequest): Promise<Rotation> {
    const response = await this.fetchWithAuth<ApiRotationResponse>(`/api/v1/rotation/${rotationId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return new Rotation(response);
  }

  async remove(rotationId: string): Promise<void> {
    await this.fetchWithAuth<void>(`/api/v1/rotation/${rotationId}`, { method: "DELETE" });
  }

  async addLeg(rotationId: string, data: AddLegRequest): Promise<Rotation> {
    const response = await this.fetchWithAuth<ApiRotationResponse>(`/api/v1/rotation/${rotationId}/leg`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return new Rotation(response);
  }

  async updateLeg(rotationId: string, legId: string, data: UpdateLegRequest): Promise<Rotation> {
    const response = await this.fetchWithAuth<ApiRotationResponse>(`/api/v1/rotation/${rotationId}/leg/${legId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return new Rotation(response);
  }

  async removeLeg(rotationId: string, legId: string): Promise<Rotation> {
    const response = await this.fetchWithAuth<ApiRotationResponse>(`/api/v1/rotation/${rotationId}/leg/${legId}`, {
      method: "DELETE",
    });
    return new Rotation(response);
  }

  async attachFlight(rotationId: string, legId: string, flightId: string): Promise<Rotation> {
    const response = await this.fetchWithAuth<ApiRotationResponse>(
      `/api/v1/rotation/${rotationId}/leg/${legId}/flight/${flightId}`,
      { method: "PUT" },
    );
    return new Rotation(response);
  }

  async detachFlight(rotationId: string, legId: string): Promise<Rotation> {
    const response = await this.fetchWithAuth<ApiRotationResponse>(
      `/api/v1/rotation/${rotationId}/leg/${legId}/flight`,
      { method: "DELETE" },
    );
    return new Rotation(response);
  }

  async markReady(rotationId: string): Promise<Rotation> {
    const response = await this.fetchWithAuth<ApiRotationResponse>(`/api/v1/rotation/${rotationId}/ready`, {
      method: "POST",
    });
    return new Rotation(response);
  }

  async fetchMine(): Promise<Rotation[]> {
    const response = await this.fetchWithAuth<ApiRotationResponse[]>("/api/v1/user/me/rotations");
    return response.map((rotation) => new Rotation(rotation));
  }
}
