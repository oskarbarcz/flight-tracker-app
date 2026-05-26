import { AbstractApiService, AbstractAuthorizedApiService } from "~/state/api/api.service";
import { createListCache } from "~/state/api/cache/listCache";
import type {
  CreateTerminalRequest,
  EditTerminalRequest,
  GetTerminalResponse,
} from "~/state/api/request/terminal.request";

const terminalListCache = createListCache<GetTerminalResponse[]>("terminals");

export class PublicTerminalService extends AbstractApiService {
  async fetchAll(airportId: string) {
    return terminalListCache.getOrFetch(airportId, () =>
      this.request<GetTerminalResponse[]>(`/api/v1/airport/${airportId}/terminal`),
    );
  }
}

export class TerminalService extends AbstractAuthorizedApiService {
  async fetchAll(airportId: string) {
    return terminalListCache.getOrFetch(airportId, () =>
      this.fetchWithAuth<GetTerminalResponse[]>(`/api/v1/airport/${airportId}/terminal`),
    );
  }

  async fetchById(airportId: string, terminalId: string) {
    return this.fetchWithAuth<GetTerminalResponse>(`/api/v1/airport/${airportId}/terminal/${terminalId}`);
  }

  async createNew(airportId: string, terminal: CreateTerminalRequest) {
    return this.fetchWithAuth<GetTerminalResponse>(`/api/v1/airport/${airportId}/terminal`, {
      body: JSON.stringify(terminal),
      method: "POST",
    });
  }

  async update(airportId: string, terminalId: string, terminal: EditTerminalRequest) {
    return this.fetchWithAuth<GetTerminalResponse>(`/api/v1/airport/${airportId}/terminal/${terminalId}`, {
      body: JSON.stringify(terminal),
      method: "PATCH",
    });
  }

  async remove(airportId: string, terminalId: string) {
    await this.fetchWithAuth<void>(`/api/v1/airport/${airportId}/terminal/${terminalId}`, {
      method: "DELETE",
    });
  }
}
