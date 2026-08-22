import type { AirportOsmProposal, AirportOsmPushResult, AirportWeatherReport, Continent } from "~/features/airport";
import type { CreateAirportRequest, EditAirportRequest, GetAirportResponse } from "~/features/airport/request";
import type { Notam } from "~/features/notam";
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

  async fetchWeather(airportId: string) {
    return this.fetchWithAuth<AirportWeatherReport[]>(`/api/v1/airport/${airportId}/weather?source=all`);
  }

  async fetchNotams(airportId: string) {
    return this.fetchWithAuth<Notam[]>(`/api/v1/airport/${airportId}/notam`);
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

  async pullOpenStreetMapProposal(airportId: string, refresh = false) {
    const query = refresh ? "?refresh=true" : "";
    return this.fetchWithAuth<AirportOsmProposal>(`/api/v1/airport/${airportId}/enrich${query}`);
  }

  async pushOpenStreetMapProposal(airportId: string, items: string[]) {
    return this.fetchWithAuth<AirportOsmPushResult>(`/api/v1/airport/${airportId}/enrich`, {
      body: JSON.stringify({ items }),
      method: "POST",
    });
  }
}
