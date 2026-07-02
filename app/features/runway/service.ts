import type { CreateRunwayRequest, EditRunwayRequest, GetRunwayResponse } from "~/features/runway/request";
import { AbstractApiService, AbstractAuthorizedApiService } from "~/shared/api/api.service";
import { createListCache } from "~/shared/api/cache/listCache";

const runwayListCache = createListCache<GetRunwayResponse[]>("runways");

export class PublicRunwayService extends AbstractApiService {
  async fetchAll(airportId: string) {
    return runwayListCache.getOrFetch(airportId, () =>
      this.request<GetRunwayResponse[]>(`/api/v1/airport/${airportId}/runway`),
    );
  }
}

export class RunwayService extends AbstractAuthorizedApiService {
  async fetchAll(airportId: string) {
    return this.fetchWithAuth<GetRunwayResponse[]>(`/api/v1/airport/${airportId}/runway`);
  }

  async fetchById(airportId: string, runwayId: string) {
    return this.fetchWithAuth<GetRunwayResponse>(`/api/v1/airport/${airportId}/runway/${runwayId}`);
  }

  async createNew(airportId: string, runway: CreateRunwayRequest) {
    return this.fetchWithAuth<GetRunwayResponse>(`/api/v1/airport/${airportId}/runway`, {
      body: JSON.stringify(runway),
      method: "POST",
    });
  }

  async update(airportId: string, runwayId: string, runway: EditRunwayRequest) {
    return this.fetchWithAuth<GetRunwayResponse>(`/api/v1/airport/${airportId}/runway/${runwayId}`, {
      body: JSON.stringify(runway),
      method: "PATCH",
    });
  }

  async remove(airportId: string, runwayId: string) {
    await this.fetchWithAuth<void>(`/api/v1/airport/${airportId}/runway/${runwayId}`, {
      method: "DELETE",
    });
  }
}
