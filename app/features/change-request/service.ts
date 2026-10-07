import { ChangeRequest, ChangeRequestDetail } from "~/features/change-request/model";
import type {
  ApiChangeRequestResponse,
  ApiChangeRequestWithFieldsResponse,
  ChangeRequestListFilters,
  RejectChangeRequestRequest,
} from "~/features/change-request/request";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

export class ChangeRequestService extends AbstractAuthorizedApiService {
  async fetchAll(filters: ChangeRequestListFilters = {}): Promise<ChangeRequest[]> {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.resource) params.set("resource", filters.resource);
    const query = params.size > 0 ? `?${params.toString()}` : "";

    const response = await this.fetchWithAuth<ApiChangeRequestResponse[]>(`/api/v1/user-data-change-request${query}`);
    return response.map((request) => new ChangeRequest(request));
  }

  async fetchById(id: string): Promise<ChangeRequestDetail> {
    const response = await this.fetchWithAuth<ApiChangeRequestWithFieldsResponse>(
      `/api/v1/user-data-change-request/${id}`,
    );
    return new ChangeRequestDetail(response);
  }

  async accept(id: string): Promise<ChangeRequestDetail> {
    const response = await this.fetchWithAuth<ApiChangeRequestWithFieldsResponse>(
      `/api/v1/user-data-change-request/${id}/accept`,
      { method: "POST" },
    );
    return new ChangeRequestDetail(response);
  }

  async reject(id: string, body: RejectChangeRequestRequest): Promise<ChangeRequestDetail> {
    const response = await this.fetchWithAuth<ApiChangeRequestWithFieldsResponse>(
      `/api/v1/user-data-change-request/${id}/reject`,
      { method: "POST", body: JSON.stringify(body) },
    );
    return new ChangeRequestDetail(response);
  }
}
