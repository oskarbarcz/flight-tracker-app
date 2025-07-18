import {
  CreateFlightDto,
  Flight,
  FlightPathElement,
  FlightStatus,
  Loadsheet,
  Schedule,
} from "~/models";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";

export class FlightService extends AbstractAuthorizedApiService {
  async fetchAllFlights(): Promise<Flight[]> {
    return this.requestWithAuth<Flight[]>("/api/v1/flight");
  }

  async fetchAllCreatedFlights(): Promise<Flight[]> {
    const allFlights = await this.fetchAllFlights();
    return allFlights.filter(
      (flight) => flight.status === FlightStatus.Created,
    );
  }

  async createNew(flight: CreateFlightDto): Promise<Flight> {
    return this.requestWithAuth<Flight>("/api/v1/flight", {
      body: JSON.stringify(flight),
      method: "POST",
    });
  }

  async getById(id: string): Promise<Flight> {
    return this.requestWithAuth<Flight>(`/api/v1/flight/${id}`);
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

  async checkIn(id: string, timesheet: Schedule): Promise<void> {
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
}
