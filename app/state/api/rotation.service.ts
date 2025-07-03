import { AbstractApiService } from "~/state/api/api.service";
import { CreateRotationDto, EditRotationDto, Rotation } from "~/models";

export class RotationService extends AbstractApiService {
  async getAll(): Promise<Rotation[]> {
    return this.requestWithAuth<Rotation[]>("/api/v1/rotation");
  }

  async createNew(rotation: CreateRotationDto): Promise<Rotation> {
    return this.requestWithAuth<Rotation>("/api/v1/rotation", {
      body: JSON.stringify(rotation),
      method: "POST",
    });
  }

  async getById(id: string): Promise<Rotation> {
    return this.requestWithAuth<Rotation>(`/api/v1/rotation/${id}`);
  }

  async update(id: string, rotation: EditRotationDto): Promise<Rotation> {
    return this.requestWithAuth<Rotation>(`/api/v1/rotation/${id}`, {
      body: JSON.stringify(rotation),
      method: "PATCH",
    });
  }

  async remove(id: string): Promise<void> {
    await this.requestWithAuth<Rotation>(`/api/v1/rotation/${id}`, {
      method: "DELETE",
    });
  }
}
