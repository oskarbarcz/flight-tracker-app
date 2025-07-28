"use client";

import { SkyLinkAirportResponse } from "~/models";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";

export class SkyLinkService extends AbstractAuthorizedApiService {
  async getAirportByIataCode(
    iataCode: string,
  ): Promise<SkyLinkAirportResponse> {
    return this.requestWithAuth<SkyLinkAirportResponse>(
      `/api/v1/skylink/airport/${iataCode}`,
    );
  }
}
