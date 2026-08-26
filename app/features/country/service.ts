import type { Country } from "~/features/country/model";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

type GetCountriesResponse = {
  countries: Country[];
};

export class CountryService extends AbstractAuthorizedApiService {
  async fetchAll(): Promise<Country[]> {
    const response = await this.fetchWithAuth<GetCountriesResponse>("/api/v1/country");

    return response.countries;
  }
}
