import type { ActivityDay, AircraftTypeStat, PeriodStats, StatsSummary } from "~/features/stats/model";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

type ActivityResponse = {
  days: ActivityDay[];
};

type AircraftTypesResponse = {
  types: AircraftTypeStat[];
};

export class StatsService extends AbstractAuthorizedApiService {
  async fetchSummary(): Promise<StatsSummary> {
    return this.fetchWithAuth<StatsSummary>("/api/v1/user/me/stats/summary");
  }

  async fetchPeriods(): Promise<PeriodStats> {
    return this.fetchWithAuth<PeriodStats>("/api/v1/user/me/stats/periods");
  }

  async fetchActivity(from: string, to: string): Promise<ActivityDay[]> {
    const query = new URLSearchParams({ from, to });
    const response = await this.fetchWithAuth<ActivityResponse>(`/api/v1/user/me/stats/activity?${query}`);
    return response.days;
  }

  async fetchAircraftTypes(): Promise<AircraftTypeStat[]> {
    const response = await this.fetchWithAuth<AircraftTypesResponse>("/api/v1/user/me/stats/aircraft-types");
    return response.types;
  }
}
