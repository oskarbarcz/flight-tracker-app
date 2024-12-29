export type Airport = {
  id: string;
  icaoCode: string;
  name: string;
  country: string;
  timezone: string;
};

export type CreateAirportDto = Omit<Airport, "id">;
export type EditAirportDto = CreateAirportDto;
