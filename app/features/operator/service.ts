import type { Operator, OperatorServiceType } from "~/features/operator";
import type { CreateOperatorRequest, EditOperatorRequest } from "~/features/operator/request";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

export type OperatorListFilters = {
  serviceType?: OperatorServiceType;
};

function listQuery(filters: OperatorListFilters, recentOnly = false): string {
  const params = new URLSearchParams();

  if (recentOnly) {
    params.set("recentOnly", "true");
  }
  if (filters.serviceType) {
    params.set("serviceType", filters.serviceType);
  }

  const query = params.toString();
  return query === "" ? "" : `?${query}`;
}

export class OperatorService extends AbstractAuthorizedApiService {
  async fetchAll(filters: OperatorListFilters = {}) {
    return this.fetchWithAuth<Operator[]>(`/api/v1/operator${listQuery(filters)}`);
  }

  async fetchRecent(filters: OperatorListFilters = {}) {
    return this.fetchWithAuth<Operator[]>(`/api/v1/operator${listQuery(filters, true)}`);
  }

  async fetchById(id: string) {
    return this.fetchWithAuth<Operator>(`/api/v1/operator/${id}`);
  }

  async createNew(operator: CreateOperatorRequest) {
    return this.fetchWithAuth<Operator>("/api/v1/operator", {
      body: JSON.stringify(operator),
      method: "POST",
    });
  }

  async update(id: string, data: EditOperatorRequest) {
    return this.fetchWithAuth<Operator>(`/api/v1/operator/${id}`, {
      body: JSON.stringify(data),
      method: "PATCH",
    });
  }
}
