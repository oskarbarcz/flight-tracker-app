"use client";

import { AbstractAuthorizedApiService } from "~/state/api/api.service";
import type { SkyLinkAirportResponse } from "~/state/api/request/skylink.request";

export class SkyLinkService extends AbstractAuthorizedApiService {
  async fetchAirportByIataCode(iataCode: string) {
    return this.fetchWithAuth<SkyLinkAirportResponse>(`/api/v1/skylink/airport/${iataCode}`);
  }
}
