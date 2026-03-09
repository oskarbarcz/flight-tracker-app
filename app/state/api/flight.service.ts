import {
  type FilledSchedule,
  Flight,
  type FlightEvent,
  type FlightOfp,
  type FlightPathElement,
  type FlightPhase,
  type Loadsheet,
  type Schedule,
  type Tracking,
} from "~/models";
import { AbstractApiService, AbstractAuthorizedApiService } from "~/state/api/api.service";
import type { ApiFlightResponse, CreateFlightRequest } from "~/state/api/request/flight.request";

type FlightListFilters = {
  phase?: FlightPhase;
  page?: number;
  limit?: number;
};

export class FlightService extends AbstractAuthorizedApiService {
  async fetchAllFlights({ phase = undefined, page = 1, limit = 100 }: FlightListFilters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(phase !== undefined && { phase }),
    });

    const url = `/api/v1/flight?${params.toString()}`;

    const { data, headers } = await this.requestWithAuthAndHeaders<ApiFlightResponse[]>(url);

    const totalCount = Number.parseInt(headers.get("X-Total-Count") ?? "0", 10);

    return {
      flights: data.map((flight) => new Flight(flight)),
      totalCount,
    };
  }

  async fetchById(id: string) {
    const response = await this.fetchWithAuth<ApiFlightResponse>(`/api/v1/flight/${id}`);

    return new Flight(response);
  }

  async createNew(flight: CreateFlightRequest): Promise<Flight> {
    const response = await this.fetchWithAuth<ApiFlightResponse>("/api/v1/flight", {
      body: JSON.stringify(flight),
      method: "POST",
    });

    return new Flight(response);
  }

  async fetchOfpByFlightId(id: string): Promise<FlightOfp> {
    return this.fetchWithAuth<FlightOfp>(`/api/v1/flight/${id}/ofp`);
  }

  async fetchEventsByFlightId(id: string): Promise<FlightEvent[]> {
    const events = await this.fetchWithAuth<FlightEvent[]>(`/api/v1/flight/${id}/events`);

    const eventsWithTypesAdjusted = events.map((event) => ({
      ...event,
      createdAt: new Date(event.createdAt),
    }));

    return eventsWithTypesAdjusted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async fetchFlightPath(id: string): Promise<FlightPathElement[]> {
    return this.fetchWithAuth<FlightPathElement[]>(`/api/v1/flight/${id}/path`);
  }

  async updateScheduledTimesheet(id: string, timesheet: Schedule): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${id}/timesheet/scheduled`, {
      body: JSON.stringify(timesheet),
      method: "PATCH",
    });
  }

  async updatePreliminaryLoadsheet(id: string, loadsheet: Loadsheet): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${id}/loadsheet/preliminary`, {
      body: JSON.stringify(loadsheet),
      method: "PATCH",
    });
  }

  async markAsReady(id: string): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${id}/mark-as-ready`, {
      method: "POST",
    });
  }

  async checkIn(id: string, timesheet: FilledSchedule): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${id}/check-in`, {
      body: JSON.stringify(timesheet),
      method: "POST",
    });
  }

  async startBoarding(id: string): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${id}/start-boarding`, {
      method: "POST",
    });
  }

  async finishBoarding(id: string, loadsheet: Loadsheet): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${id}/finish-boarding`, {
      body: JSON.stringify(loadsheet),
      method: "POST",
    });
  }

  async reportOffBlock(id: string): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${id}/report-off-block`, {
      method: "POST",
    });
  }

  async reportTakeoff(id: string): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${id}/report-takeoff`, {
      method: "POST",
    });
  }

  async reportArrival(id: string): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${id}/report-arrival`, {
      method: "POST",
    });
  }

  async reportOnBlock(id: string): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${id}/report-on-block`, {
      method: "POST",
    });
  }

  async startOffboarding(id: string): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${id}/start-offboarding`, {
      method: "POST",
    });
  }

  async finishOffboarding(id: string): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${id}/finish-offboarding`, {
      method: "POST",
    });
  }

  async close(id: string): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${id}/close`, {
      method: "POST",
    });
  }

  async remove(id: string): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${id}`, {
      method: "DELETE",
    });
  }

  async importFlightFromSimbrief(): Promise<Flight> {
    const response = await this.fetchWithAuth<ApiFlightResponse>("/api/v1/flight/create-with-simbrief", {
      method: "POST",
    });

    return new Flight(response);
  }

  async updateTracking(id: string, tracking: Tracking): Promise<void> {
    return this.fetchWithAuth<void>(`/api/v1/flight/${id}/tracking`, {
      body: JSON.stringify({ tracking }),
      method: "PATCH",
    });
  }
}

export class PublicFlightService extends AbstractApiService {
  async fetchById(id: string): Promise<Flight> {
    const response = await this.request<ApiFlightResponse>(`/api/v1/flight/${id}`);

    return new Flight(response);
  }
}
