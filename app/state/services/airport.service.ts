import { Airport, CreateAirportDto, EditAirportDto } from "~/models";

export const AirportService = {
  getToken: (): string => {
    const token: string | null = localStorage.getItem("token");

    if (token === null) {
      throw new Error("Unauthorized");
    }

    return <string>token;
  },

  fetchAllAirports: async (): Promise<Airport[]> => {
    const response = await fetch("http://localhost/api/v1/airport", {
      headers: {
        Authorization: `Bearer ${AirportService.getToken()}`,
      },
    });

    if (response.status === 401) {
      AirportService.handleUnauthorized();
    }

    return response.json();
  },

  fetchById: async (id: string): Promise<Airport> => {
    const response = await fetch(`http://localhost/api/v1/airport/${id}`, {
      headers: {
        Authorization: `Bearer ${AirportService.getToken()}`,
      },
    });

    if (response.status === 401) {
      AirportService.handleUnauthorized();
    }

    return response.json();
  },

  createNewAirport: async (airport: CreateAirportDto): Promise<Airport> => {
    const response = await fetch("http://localhost/api/v1/airport", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AirportService.getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(airport),
    });

    if (response.status === 401) {
      AirportService.handleUnauthorized();
    }

    return response.json();
  },

  update: async (airport: EditAirportDto): Promise<Airport> => {
    const response = await fetch("http://localhost/api/v1/airport", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AirportService.getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(airport),
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
