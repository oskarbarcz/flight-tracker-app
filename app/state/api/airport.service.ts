import { Airport, CreateAirportDto, EditAirportDto } from "~/models";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";

export class AirportService extends AbstractAuthorizedApiService {
  async getAll(): Promise<Airport[]> {
    return this.requestWithAuth<Airport[]>("/api/v1/airport");
  }

  async createNew(airport: CreateAirportDto): Promise<Airport> {
    return this.requestWithAuth<Airport>("/api/v1/airport", {
      body: JSON.stringify(airport),
      method: "POST",
    });
  }

  async getById(id: string): Promise<Airport> {
    return this.requestWithAuth<Airport>(`/api/v1/airport/${id}`);
  }

  async update(id: string, airport: EditAirportDto): Promise<Airport> {
    return this.requestWithAuth<Airport>(`/api/v1/airport/${id}`, {
      body: JSON.stringify(airport),
      method: "PATCH",
    });
  }
}
