import { CreateOperatorDto, EditOperatorDto, Operator } from "~/models";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";

export class OperatorService extends AbstractAuthorizedApiService {
  async fetchAll(): Promise<Operator[]> {
    return this.requestWithAuth<Operator[]>("/api/v1/operator");
  }

  async fetchById(id: string): Promise<Operator> {
    return this.requestWithAuth<Operator>(`/api/v1/operator/${id}`);
  }

  async createNew(operator: CreateOperatorDto): Promise<Operator> {
    return this.requestWithAuth<Operator>("/api/v1/operator", {
      body: JSON.stringify(operator),
      method: "POST",
    });
  }

  async update(id: string, data: EditOperatorDto): Promise<Operator> {
    return this.requestWithAuth<Operator>(`/api/v1/operator/${id}`, {
      body: JSON.stringify(data),
      method: "PATCH",
    });
  }
}
