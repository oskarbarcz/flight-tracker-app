import { FlightStatus, Flight, Timesheet } from "~/models";

export const FlightService = {
  getToken: (): string => {
    const token: string | null = localStorage.getItem("token");

    if (token === null) {
      throw new Error("Unauthorized");
    }

    return <string>token;
  },

  fetchFlightById: async (id: string): Promise<Flight> => {
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

  fetchAllFlights: async (): Promise<Flight[]> => {
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

  getNextAction: (state: FlightStatus): FlightStatus | undefined => {
    const nextStatus = {
      [FlightStatus.Created]: FlightStatus.Ready,
      [FlightStatus.Ready]: FlightStatus.CheckedIn,
      [FlightStatus.CheckedIn]: FlightStatus.BoardingStarted,
      [FlightStatus.BoardingStarted]: FlightStatus.BoardingFinished,
      [FlightStatus.BoardingFinished]: FlightStatus.TaxiingOut,
      [FlightStatus.TaxiingOut]: FlightStatus.InCruise,
      [FlightStatus.InCruise]: FlightStatus.TaxiingIn,
      [FlightStatus.TaxiingIn]: FlightStatus.OnBlock,
      [FlightStatus.OnBlock]: FlightStatus.OffboardingStarted,
      [FlightStatus.OffboardingStarted]: FlightStatus.OffboardingFinished,
      [FlightStatus.OffboardingFinished]: FlightStatus.Closed,
      [FlightStatus.Closed]: undefined,
    } as Record<FlightStatus, FlightStatus | undefined>;

    return nextStatus[state];
  },

  checkIn: async (
    flightId: string,
    estimatedTimesheet: Timesheet,
  ): Promise<void> => {
    const response = await fetch(
      `http://localhost/api/v1/flight/${flightId}/check-in`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FlightService.getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(estimatedTimesheet),
      },
    );

    if (response.status === 401) {
      FlightService.handleUnauthorized();
    }
  },

  startBoarding: async (flightId: string): Promise<void> => {
    const response = await fetch(
      `http://localhost/api/v1/flight/${flightId}/start-boarding`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FlightService.getToken()}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 401) {
      FlightService.handleUnauthorized();
    }
  },

  finishBoarding: async (flightId: string): Promise<void> => {
    const response = await fetch(
      `http://localhost/api/v1/flight/${flightId}/finish-boarding`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FlightService.getToken()}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 401) {
      FlightService.handleUnauthorized();
    }
  },

  reportOffBlock: async (flightId: string): Promise<void> => {
    const response = await fetch(
      `http://localhost/api/v1/flight/${flightId}/report-off-block`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FlightService.getToken()}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 401) {
      FlightService.handleUnauthorized();
    }
  },

  reportTakeoff: async (flightId: string): Promise<void> => {
    const response = await fetch(
      `http://localhost/api/v1/flight/${flightId}/report-takeoff`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FlightService.getToken()}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 401) {
      FlightService.handleUnauthorized();
    }
  },

  reportArrival: async (flightId: string): Promise<void> => {
    const response = await fetch(
      `http://localhost/api/v1/flight/${flightId}/report-arrival`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FlightService.getToken()}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 401) {
      FlightService.handleUnauthorized();
    }
  },

  reportOnBlock: async (flightId: string): Promise<void> => {
    const response = await fetch(
      `http://localhost/api/v1/flight/${flightId}/report-on-block`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FlightService.getToken()}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 401) {
      FlightService.handleUnauthorized();
    }
  },

  startOffboarding: async (flightId: string): Promise<void> => {
    const response = await fetch(
      `http://localhost/api/v1/flight/${flightId}/start-offboarding`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FlightService.getToken()}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 401) {
      FlightService.handleUnauthorized();
    }
  },

  finishOffboarding: async (flightId: string): Promise<void> => {
    const response = await fetch(
      `http://localhost/api/v1/flight/${flightId}/finish-offboarding`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FlightService.getToken()}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 401) {
      FlightService.handleUnauthorized();
    }
  },

  close: async (flightId: string): Promise<void> => {
    const response = await fetch(
      `http://localhost/api/v1/flight/${flightId}/close`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FlightService.getToken()}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 401) {
      FlightService.handleUnauthorized();
    }
  },
};
