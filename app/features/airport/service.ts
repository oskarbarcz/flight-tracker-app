import type { Continent } from "~/features/airport";
import type { CreateAirportRequest, EditAirportRequest, GetAirportResponse } from "~/features/airport/request";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

type AirportListFilters = {
  continent?: Continent;
};

export class AirportService extends AbstractAuthorizedApiService {
  async fetchAll(filters: AirportListFilters = {}) {
    const params = new URLSearchParams({
      ...filters,
    });
    return this.fetchWithAuth<GetAirportResponse[]>(`/api/v1/airport?${params.toString()}`);
  }

  async fetchById(id: string) {
    return this.fetchWithAuth<GetAirportResponse>(`/api/v1/airport/${id}`);
  }

  async createNew(airport: CreateAirportRequest) {
    return this.fetchWithAuth<GetAirportResponse>("/api/v1/airport", {
      body: JSON.stringify(airport),
      method: "POST",
    });
  }

  async update(id: string, airport: EditAirportRequest) {
    return this.fetchWithAuth<GetAirportResponse>(`/api/v1/airport/${id}`, {
      body: JSON.stringify(airport),
      method: "PATCH",
    });
  }
}
