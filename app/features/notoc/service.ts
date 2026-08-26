import type { FlightNotoc, NotocStage } from "~/features/notoc/model";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

export class NotocService extends AbstractAuthorizedApiService {
  async fetchByFlightId(id: string, stage?: NotocStage): Promise<FlightNotoc> {
    const query = stage === undefined ? "" : `?stage=${stage}`;
    return this.fetchWithAuth<FlightNotoc>(`/api/v1/flight/${id}/notoc${query}`);
  }
}
