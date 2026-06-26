export type InitiateTravelFormData = {
  destinationAirportId: string;
};

export function initInitiateTravelData(): InitiateTravelFormData {
  return {
    destinationAirportId: "",
  };
}
