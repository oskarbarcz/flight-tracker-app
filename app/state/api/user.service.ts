import { AbstractApiService } from "~/state/api/api.service";
import { GetUserResponse } from "~/models";

export class UserService extends AbstractApiService {
  async getCurrent(): Promise<GetUserResponse> {
    return this.requestWithAuth<GetUserResponse>("/api/v1/user/me");
  }
}
