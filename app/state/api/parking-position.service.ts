import { AbstractApiService, AbstractAuthorizedApiService } from "~/state/api/api.service";
import { createListCache } from "~/state/api/cache/listCache";
import type {
  CreateParkingPositionRequest,
  EditParkingPositionRequest,
  GetParkingPositionResponse,
} from "~/state/api/request/parking-position.request";

const parkingPositionListCache = createListCache<GetParkingPositionResponse[]>("parking-positions");

export class PublicParkingPositionService extends AbstractApiService {
  async fetchAll(airportId: string) {
    return parkingPositionListCache.getOrFetch(airportId, () =>
      this.request<GetParkingPositionResponse[]>(`/api/v1/airport/${airportId}/parking-position`),
    );
  }
}

export class ParkingPositionService extends AbstractAuthorizedApiService {
  async fetchAll(airportId: string) {
    return this.fetchWithAuth<GetParkingPositionResponse[]>(`/api/v1/airport/${airportId}/parking-position`);
  }

  async fetchAllCached(airportId: string) {
    return parkingPositionListCache.getOrFetch(airportId, () =>
      this.fetchWithAuth<GetParkingPositionResponse[]>(`/api/v1/airport/${airportId}/parking-position`),
    );
  }

  async fetchById(airportId: string, parkingPositionId: string) {
    return this.fetchWithAuth<GetParkingPositionResponse>(
      `/api/v1/airport/${airportId}/parking-position/${parkingPositionId}`,
    );
  }

  async createNew(airportId: string, parkingPosition: CreateParkingPositionRequest) {
    return this.fetchWithAuth<GetParkingPositionResponse>(`/api/v1/airport/${airportId}/parking-position`, {
      body: JSON.stringify(parkingPosition),
      method: "POST",
    });
  }

  async update(airportId: string, parkingPositionId: string, parkingPosition: EditParkingPositionRequest) {
    return this.fetchWithAuth<GetParkingPositionResponse>(
      `/api/v1/airport/${airportId}/parking-position/${parkingPositionId}`,
      {
        body: JSON.stringify(parkingPosition),
        method: "PATCH",
      },
    );
  }

  async remove(airportId: string, parkingPositionId: string) {
    await this.fetchWithAuth<void>(`/api/v1/airport/${airportId}/parking-position/${parkingPositionId}`, {
      method: "DELETE",
    });
  }
}
