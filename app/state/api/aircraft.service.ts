import { Aircraft, CreateAircraftRequest, EditAircraftRequest } from "~/models";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";

export class AircraftService extends AbstractAuthorizedApiService {
  async fetchAll(): Promise<Aircraft[]> {
    return this.requestWithAuth<Aircraft[]>("/api/v1/aircraft");
  }

  async fetchAllByOperator(operatorId: string): Promise<Aircraft[]> {
    return this.requestWithAuth<Aircraft[]>(
      `/api/v1/operator/${operatorId}/aircraft`,
    );
  }

  async createNew(
    operatorId: string,
    data: CreateAircraftRequest,
  ): Promise<Aircraft> {
    return this.requestWithAuth<Aircraft>(
      `/api/v1/operator/${operatorId}/aircraft`,
      {
        body: JSON.stringify(data),
        method: "POST",
      },
    );
  }

  async getById(id: string): Promise<Aircraft> {
    return this.requestWithAuth<Aircraft>(`/api/v1/aircraft/${id}`);
  }

  async update(
    operatorId: string,
    aircraftId: string,
    data: EditAircraftRequest,
  ): Promise<Aircraft> {
    return this.requestWithAuth<Aircraft>(
      `/api/v1/operator/${operatorId}/aircraft/${aircraftId}`,
      {
        body: JSON.stringify(data),
        method: "PATCH",
      },
    );
  }
}
