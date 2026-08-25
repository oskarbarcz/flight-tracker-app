import type { FlightCargoManifest, ShipmentStatus } from "~/features/cargo-manifest/model";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

export class CargoManifestService extends AbstractAuthorizedApiService {
  async fetchByFlightId(id: string, status?: ShipmentStatus): Promise<FlightCargoManifest> {
    const query = status === undefined ? "" : `?status=${status}`;
    return this.fetchWithAuth<FlightCargoManifest>(`/api/v1/flight/${id}/cargo-manifest${query}`);
  }
}
