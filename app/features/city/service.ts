import type { City } from "~/features/city/model";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

type ListCitiesResponse = {
  cities: City[];
};

export class CityService extends AbstractAuthorizedApiService {
  async fetchAll(): Promise<City[]> {
    return this.fetch();
  }

  async fetchWithoutPostcard(): Promise<City[]> {
    return this.fetch("?hasPostcard=false");
  }

  private async fetch(query = ""): Promise<City[]> {
    const response = await this.fetchWithAuth<ListCitiesResponse>(`/api/v1/city${query}`);

    return response.cities;
  }
}
