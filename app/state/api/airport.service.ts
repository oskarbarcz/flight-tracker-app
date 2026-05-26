import type { Continent } from "~/models";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";
import { createListCache } from "~/state/api/cache/listCache";
import type { CreateAirportRequest, EditAirportRequest, GetAirportResponse } from "~/state/api/request/airport.request";

type AirportListFilters = {
  continent?: Continent;
};

const airportListCache = createListCache<GetAirportResponse[]>("airports:list");
const airportByIdCache = createListCache<GetAirportResponse>("airports:byId");

export class AirportService extends AbstractAuthorizedApiService {
  async fetchAll(filters: AirportListFilters = {}) {
    const params = new URLSearchParams({
      ...filters,
    });
    const url = `/api/v1/airport?${params.toString()}`;
    return airportListCache.getOrFetch(url, () => this.fetchWithAuth<GetAirportResponse[]>(url));
  }

  async fetchById(id: string) {
    return airportByIdCache.getOrFetch(id, () => this.fetchWithAuth<GetAirportResponse>(`/api/v1/airport/${id}`));
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
