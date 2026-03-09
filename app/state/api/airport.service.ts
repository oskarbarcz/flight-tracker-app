import type { Continent } from "~/models";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";
import type { CreateAirportRequest, EditAirportRequest, GetAirportResponse } from "~/state/api/request/airport.request";

type AirportListFilters = {
  continent?: Continent;
};

export class AirportService extends AbstractAuthorizedApiService {
  async fetchAll(filters: AirportListFilters = {}) {
    const params = new URLSearchParams({
      ...filters,
    });

    const url = `/api/v1/airport?${params.toString()}`;
    return this.fetchWithAuth<GetAirportResponse[]>(url);
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
