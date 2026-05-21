import type { Airframe } from "~/models";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";

let airframesCache: Promise<Airframe[]> | null = null;

export class AirframeService extends AbstractAuthorizedApiService {
  async fetchAll(): Promise<Airframe[]> {
    if (!airframesCache) {
      airframesCache = this.fetchWithAuth<Airframe[]>("/api/v1/airframe").catch((error) => {
        airframesCache = null;
        throw error;
      });
    }
    return airframesCache;
  }

  async fetchByType(type: string): Promise<Airframe> {
    return this.fetchWithAuth<Airframe>(`/api/v1/airframe/${type}`);
  }
}
