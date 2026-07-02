import type { SkyLinkAirportResponse } from "~/features/skylink/request";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

export class SkyLinkService extends AbstractAuthorizedApiService {
  async fetchAirportByIataCode(iataCode: string) {
    return this.fetchWithAuth<SkyLinkAirportResponse>(`/api/v1/skylink/airport/${iataCode}`);
  }
}
