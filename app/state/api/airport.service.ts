import {
  Continent,
  CreateAirportRequest,
  EditAirportRequest,
  GetAirportResponse,
} from "~/models";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";

export class AirportService extends AbstractAuthorizedApiService {
  async getAll(): Promise<GetAirportResponse[]> {
    return this.requestWithAuth<GetAirportResponse[]>("/api/v1/airport");
  }

  async getAllByContinent(continent: Continent): Promise<GetAirportResponse[]> {
    return this.requestWithAuth<GetAirportResponse[]>(
      `/api/v1/airport?continent=${continent}`,
    );
  }

  async createNew(airport: CreateAirportRequest): Promise<GetAirportResponse> {
    return this.requestWithAuth<GetAirportResponse>("/api/v1/airport", {
      body: JSON.stringify(airport),
      method: "POST",
    });
  }

  async getById(id: string): Promise<GetAirportResponse> {
    return this.requestWithAuth<GetAirportResponse>(`/api/v1/airport/${id}`);
  }

  async update(
    id: string,
    airport: EditAirportRequest,
  ): Promise<GetAirportResponse> {
    return this.requestWithAuth<GetAirportResponse>(`/api/v1/airport/${id}`, {
      body: JSON.stringify(airport),
      method: "PATCH",
    });
  }
}
