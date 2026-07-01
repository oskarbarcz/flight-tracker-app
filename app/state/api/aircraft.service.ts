import type { Aircraft, AircraftReposition, FlightHistoryEntry } from "~/models";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";
import type {
  CreateAircraftRequest,
  CreateRepositionRequest,
  EditAircraftRequest,
} from "~/state/api/request/operator.request";

export class AircraftService extends AbstractAuthorizedApiService {
  async fetchAll(operatorId: string): Promise<Aircraft[]> {
    return this.fetchWithAuth<Aircraft[]>(`/api/v1/operator/${operatorId}/aircraft`);
  }

  async fetchById(operatorId: string, aircraftId: string): Promise<Aircraft> {
    return this.fetchWithAuth<Aircraft>(`/api/v1/operator/${operatorId}/aircraft/${aircraftId}`);
  }

  async fetchFlightHistory(operatorId: string, aircraftId: string): Promise<FlightHistoryEntry[]> {
    return this.fetchWithAuth<FlightHistoryEntry[]>(`/api/v1/operator/${operatorId}/aircraft/${aircraftId}/flights`);
  }

  async fetchRepositionHistory(operatorId: string, aircraftId: string): Promise<AircraftReposition[]> {
    return this.fetchWithAuth<AircraftReposition[]>(`/api/v1/operator/${operatorId}/aircraft/${aircraftId}/reposition`);
  }

  async createReposition(
    operatorId: string,
    aircraftId: string,
    data: CreateRepositionRequest,
  ): Promise<AircraftReposition> {
    return this.fetchWithAuth<AircraftReposition>(`/api/v1/operator/${operatorId}/aircraft/${aircraftId}/reposition`, {
      body: JSON.stringify(data),
      method: "POST",
    });
  }

  async createNew(operatorId: string, data: CreateAircraftRequest) {
    return this.fetchWithAuth<Aircraft>(`/api/v1/operator/${operatorId}/aircraft`, {
      body: JSON.stringify(data),
      method: "POST",
    });
  }

  async update(operatorId: string, aircraftId: string, data: EditAircraftRequest) {
    return this.fetchWithAuth<Aircraft>(`/api/v1/operator/${operatorId}/aircraft/${aircraftId}`, {
      body: JSON.stringify(data),
      method: "PATCH",
    });
  }
}
