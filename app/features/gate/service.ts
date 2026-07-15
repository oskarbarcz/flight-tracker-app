import type { CreateGateRequest, EditGateRequest, GetGateResponse } from "~/features/gate/request";
import { AbstractApiService, AbstractAuthorizedApiService } from "~/shared/api/api.service";
import { createListCache } from "~/shared/api/cache/listCache";

const gateListCache = createListCache<GetGateResponse[]>("gates");

export class PublicGateService extends AbstractApiService {
  async fetchAll(airportId: string) {
    return gateListCache.getOrFetch(airportId, () =>
      this.request<GetGateResponse[]>(`/api/v1/airport/${airportId}/gate`),
    );
  }
}

export class GateService extends AbstractAuthorizedApiService {
  async fetchAll(airportId: string) {
    return this.fetchWithAuth<GetGateResponse[]>(`/api/v1/airport/${airportId}/gate`);
  }

  async fetchById(airportId: string, gateId: string) {
    return this.fetchWithAuth<GetGateResponse>(`/api/v1/airport/${airportId}/gate/${gateId}`);
  }

  async createNew(airportId: string, gate: CreateGateRequest) {
    return this.fetchWithAuth<GetGateResponse>(`/api/v1/airport/${airportId}/gate`, {
      body: JSON.stringify(gate),
      method: "POST",
    });
  }

  async update(airportId: string, gateId: string, gate: EditGateRequest) {
    return this.fetchWithAuth<GetGateResponse>(`/api/v1/airport/${airportId}/gate/${gateId}`, {
      body: JSON.stringify(gate),
      method: "PATCH",
    });
  }

  async remove(airportId: string, gateId: string) {
    await this.fetchWithAuth<void>(`/api/v1/airport/${airportId}/gate/${gateId}`, {
      method: "DELETE",
    });
  }
}
