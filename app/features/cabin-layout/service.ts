import type {
  CabinLayout,
  CabinLayoutFilters,
  CabinLayoutList,
  CabinLayoutRefreshResult,
  CabinLayoutSyncResult,
  CabinSeatMap,
} from "~/features/cabin-layout/model";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

function listQuery(filters: CabinLayoutFilters): string {
  const params = new URLSearchParams();

  if (filters.airlineIata) {
    params.set("airlineIata", filters.airlineIata);
  }
  if (filters.aircraftIata) {
    params.set("aircraftIata", filters.aircraftIata);
  }
  if (filters.retired !== undefined) {
    params.set("retired", String(filters.retired));
  }
  if (filters.limit !== undefined) {
    params.set("limit", String(filters.limit));
  }
  if (filters.offset !== undefined) {
    params.set("offset", String(filters.offset));
  }

  const query = params.toString();
  return query === "" ? "" : `?${query}`;
}

export class CabinLayoutService extends AbstractAuthorizedApiService {
  async list(filters: CabinLayoutFilters = {}) {
    return this.fetchWithAuth<CabinLayoutList>(`/api/v1/cabin-layout${listQuery(filters)}`);
  }

  async fetchById(id: string) {
    return this.fetchWithAuth<CabinLayout>(`/api/v1/cabin-layout/${id}`);
  }

  async fetchSeatMap(id: string) {
    return this.fetchWithAuth<CabinSeatMap>(`/api/v1/cabin-layout/${id}/seat-map`);
  }

  async sync() {
    return this.fetchWithAuth<CabinLayoutSyncResult>("/api/v1/cabin-layout/sync", { method: "POST" });
  }

  async refresh(id: string) {
    return this.fetchWithAuth<CabinLayoutRefreshResult>(`/api/v1/cabin-layout/${id}/refresh`, { method: "POST" });
  }
}
