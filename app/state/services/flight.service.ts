import { ScheduledFlightsListElement } from "~/models";

export const FlightService = {
  getToken: (): string => {
    const token: string | null = localStorage.getItem("token");

    if (token === null) {
      throw new Error("Unauthorized");
    }

    return <string>token;
  },

  fetchFlightById: async (id: string): Promise<ScheduledFlightsListElement> => {
    const response = await fetch(`http://localhost/api/v1/flight/${id}`, {
      headers: {
        Authorization: `Bearer ${FlightService.getToken()}`,
      },
    });

    if (response.status === 401) {
      FlightService.handleUnauthorized();
    }

    return response.json();
  },

  fetchAllFlights: async (): Promise<ScheduledFlightsListElement[]> => {
    const flights = await fetch("http://localhost/api/v1/flight", {
      headers: {
        Authorization: `Bearer ${FlightService.getToken()}`,
      },
    });

    return flights.json();
  },

  handleUnauthorized: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
