import type { Operator } from "~/models";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";
import type { CreateOperatorRequest, EditOperatorRequest } from "~/state/api/request/operator.request";

export class OperatorService extends AbstractAuthorizedApiService {
  async fetchAll() {
    return this.fetchWithAuth<Operator[]>("/api/v1/operator");
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
