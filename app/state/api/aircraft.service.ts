import { Aircraft, CreateAircraftDto, EditAircraftDto } from "~/models";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";

export class AircraftService extends AbstractAuthorizedApiService {
  async fetchAll(): Promise<Aircraft[]> {
    return this.requestWithAuth<Aircraft[]>("/api/v1/aircraft");
  }

  async createNew(aircraft: CreateAircraftDto): Promise<Aircraft> {
    return this.requestWithAuth<Aircraft>("/api/v1/aircraft", {
      body: JSON.stringify(aircraft),
      method: "POST",
    });
  }

  async getById(id: string): Promise<Aircraft> {
    return this.requestWithAuth<Aircraft>(`/api/v1/aircraft/${id}`);
  }

  async update(id: string, aircraft: EditAircraftDto): Promise<Aircraft> {
    return this.requestWithAuth<Aircraft>(`/api/v1/aircraft/${id}`, {
      body: JSON.stringify(aircraft),
      method: "PATCH",
    });
  }
}
