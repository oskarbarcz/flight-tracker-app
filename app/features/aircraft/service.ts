import type { Aircraft, AircraftReposition, FlightHistoryEntry, UserAircraftEntry } from "~/features/aircraft";
import type { CabinLayoutSuggestionList } from "~/features/cabin-layout/model";
import type { CreateAircraftRequest, CreateRepositionRequest, EditAircraftRequest } from "~/features/operator/request";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

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

  async fetchFlownByCurrentUser(): Promise<UserAircraftEntry[]> {
    return this.fetchWithAuth<UserAircraftEntry[]>("/api/v1/user/me/aircraft");
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

  async fetchCabinLayoutSuggestions(operatorId: string, aircraftId: string) {
    return this.fetchWithAuth<CabinLayoutSuggestionList>(
      `/api/v1/operator/${operatorId}/aircraft/${aircraftId}/cabin-layout/suggestions`,
    );
  }

  async assignCabinLayout(operatorId: string, aircraftId: string, cabinLayout: string) {
    return this.fetchWithAuth<Aircraft>(`/api/v1/operator/${operatorId}/aircraft/${aircraftId}/cabin-layout`, {
      body: JSON.stringify({ cabinLayout }),
      method: "PUT",
    });
  }

  async removeCabinLayout(operatorId: string, aircraftId: string) {
    return this.fetchWithAuth<void>(`/api/v1/operator/${operatorId}/aircraft/${aircraftId}/cabin-layout`, {
      method: "DELETE",
    });
  }

  async assignHoldVariant(operatorId: string, aircraftId: string, holdVariant: string) {
    return this.fetchWithAuth<Aircraft>(`/api/v1/operator/${operatorId}/aircraft/${aircraftId}/hold-variant`, {
      body: JSON.stringify({ holdVariant }),
      method: "PUT",
    });
  }

  async update(operatorId: string, aircraftId: string, data: EditAircraftRequest) {
    return this.fetchWithAuth<Aircraft>(`/api/v1/operator/${operatorId}/aircraft/${aircraftId}`, {
      body: JSON.stringify(data),
      method: "PATCH",
    });
  }
}
