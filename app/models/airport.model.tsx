export type Airport = {
  id: string;
  icaoCode: string;
  iataCode: string;
  city: string;
  name: string;
  country: string;
  timezone: string;
};

export type CreateAirportDto = Omit<Airport, "id">;
export type EditAirportDto = CreateAirportDto;
