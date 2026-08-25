import type { AircraftHoldLayout } from "~/features/cargo-hold/model";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

export class CargoHoldService extends AbstractAuthorizedApiService {
  async fetchCatalogue(): Promise<AircraftHoldLayout[]> {
    return this.fetchWithAuth<AircraftHoldLayout[]>("/api/v1/cargo-hold");
  }

  async fetchByType(icaoCode: string): Promise<AircraftHoldLayout> {
    return this.fetchWithAuth<AircraftHoldLayout>(`/api/v1/cargo-hold/${icaoCode}`);
  }
}
