import {
  FilledSchedule,
  Flight,
  FlightEvent,
  FlightPathElement,
  FlightPhase,
  FlightStatus,
  Loadsheet,
  Schedule,
} from "~/models";
import {
  AbstractApiService,
  AbstractAuthorizedApiService,
} from "~/state/api/api.service";
import {
  ApiFlightResponse,
  CreateFlightRequest,
} from "~/state/api/model/flight.dto";

type FlightListFilters = {
  phase?: FlightPhase;
  page?: number;
  limit?: number;
};

export type PaginatedFlights = {
  flights: Flight[];
  totalCount: number;
};

export class FlightService extends AbstractAuthorizedApiService {
  async fetchAllFlights({
    phase = undefined,
    page = 1,
    limit = 100,
  }: FlightListFilters = {}): Promise<PaginatedFlights> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(phase !== undefined && { phase }),
    });

    const url = `/api/v1/flight?${params.toString()}`;

    const { data, headers } =
      await this.requestWithAuthAndHeaders<ApiFlightResponse[]>(url);

    const totalCount = Number.parseInt(headers.get("X-Total-Count") ?? "0");

    return {
      flights: data.map((flight) => new Flight(flight)),
      totalCount,
    };
  }

  async fetchAllCreatedFlights(): Promise<Flight[]> {
    const { flights } = await this.fetchAllFlights();
    return flights.filter((flight) => flight.status === FlightStatus.Created);
  }

  async createNew(flight: CreateFlightRequest): Promise<Flight> {
    const response = await this.requestWithAuth<ApiFlightResponse>(
      "/api/v1/flight",
      {
        body: JSON.stringify(flight),
        method: "POST",
      },
    );

    return new Flight(response);
  }

  async getById(id: string): Promise<Flight> {
    const response = await this.requestWithAuth<ApiFlightResponse>(
      `/api/v1/flight/${id}`,
    );

    return new Flight(response);
  }

  async getEventsByFlightId(id: string): Promise<FlightEvent[]> {
    const events = await this.requestWithAuth<FlightEvent[]>(
      `/api/v1/flight/${id}/events`,
    );

    const eventsWithTypesAdjusted = events.map((event) => ({
      ...event,
      createdAt: new Date(event.createdAt),
    }));

    return eventsWithTypesAdjusted.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async getFlightPath(id: string): Promise<FlightPathElement[]> {
    return this.requestWithAuth<FlightPathElement[]>(
      `/api/v1/flight/${id}/path`,
    );
  }

  async updateScheduledTimesheet(
    id: string,
    timesheet: Schedule,
  ): Promise<void> {
    return this.requestWithAuth<void>(
      `/api/v1/flight/${id}/timesheet/scheduled`,
      {
        body: JSON.stringify(timesheet),
        method: "PATCH",
      },
    );
  }

  async updatePreliminaryLoadsheet(
    id: string,
    loadsheet: Loadsheet,
  ): Promise<void> {
    return this.requestWithAuth<void>(
      `/api/v1/flight/${id}/loadsheet/preliminary`,
      {
        body: JSON.stringify(loadsheet),
        method: "PATCH",
      },
    );
  }

  async markAsReady(id: string): Promise<void> {
    return this.requestWithAuth<void>(`/api/v1/flight/${id}/mark-as-ready`, {
      method: "POST",
    });
  }

  async checkIn(id: string, timesheet: FilledSchedule): Promise<void> {
    return this.requestWithAuth<void>(`/api/v1/flight/${id}/check-in`, {
      body: JSON.stringify(timesheet),
      method: "POST",
    });
  }

  async startBoarding(id: string): Promise<void> {
    return this.requestWithAuth<void>(`/api/v1/flight/${id}/start-boarding`, {
      method: "POST",
    });
  }

  async finishBoarding(id: string, loadsheet: Loadsheet): Promise<void> {
    return this.requestWithAuth<void>(`/api/v1/flight/${id}/finish-boarding`, {
      body: JSON.stringify(loadsheet),
      method: "POST",
    });
  }

  async reportOffBlock(id: string): Promise<void> {
    return this.requestWithAuth<void>(`/api/v1/flight/${id}/report-off-block`, {
      method: "POST",
    });
  }

  async reportTakeoff(id: string): Promise<void> {
    return this.requestWithAuth<void>(`/api/v1/flight/${id}/report-takeoff`, {
      method: "POST",
    });
  }

  async reportArrival(id: string): Promise<void> {
    return this.requestWithAuth<void>(`/api/v1/flight/${id}/report-arrival`, {
      method: "POST",
    });
  }

  async reportOnBlock(id: string): Promise<void> {
    return this.requestWithAuth<void>(`/api/v1/flight/${id}/report-on-block`, {
      method: "POST",
    });
  }

  async startOffboarding(id: string): Promise<void> {
    return this.requestWithAuth<void>(
      `/api/v1/flight/${id}/start-offboarding`,
      {
        method: "POST",
      },
    );
  }

  async finishOffboarding(id: string): Promise<void> {
    return this.requestWithAuth<void>(
      `/api/v1/flight/${id}/finish-offboarding`,
      {
        method: "POST",
      },
    );
  }

  async close(id: string): Promise<void> {
    return this.requestWithAuth<void>(`/api/v1/flight/${id}/close`, {
      method: "POST",
    });
  }

  async remove(id: string): Promise<void> {
    return this.requestWithAuth<void>(`/api/v1/flight/${id}`, {
      method: "DELETE",
    });
  }

  async importFlightFromSimbrief(): Promise<Flight> {
    const response = await this.requestWithAuth<ApiFlightResponse>(
      "/api/v1/flight/create-with-simbrief",
      {
        method: "POST",
      },
    );

    return new Flight(response);
  }
}

export class PublicFlightService extends AbstractApiService {
  async getById(id: string): Promise<Flight> {
    const response = await this.request<ApiFlightResponse>(
      `/api/v1/flight/${id}`,
    );

    return new Flight(response);
  }

  async getFlightPath(id: string): Promise<FlightPathElement[]> {
    return this.request<FlightPathElement[]>(`/api/v1/flight/${id}/path`);
  }
}
