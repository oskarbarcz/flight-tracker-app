import {Airport} from "~/models";

export const AirportService = {
  getToken: (): string => {
    const token: string | null = localStorage.getItem("token");

    if (token === null) {
      throw new Error("Unauthorized");
    }

    return <string>token;
  },

  fetchAllAirports: async (): Promise<Airport[]> => {
    const response = await fetch('http://localhost/api/v1/airport', {
      headers: {
        Authorization: `Bearer ${AirportService.getToken()}`,
      },
    });

    if (response.status === 401) {
      AirportService.handleUnauthorized();
    }

    return response.json();
  },

  handleUnauthorized: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
