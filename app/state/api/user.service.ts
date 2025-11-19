import { GetUserResponse, ListUsersResponse } from "~/models";
import { AbstractAuthorizedApiService } from "~/state/api/api.service";

export class UserService extends AbstractAuthorizedApiService {
  async getCurrent(): Promise<GetUserResponse> {
    return this.requestWithAuth<GetUserResponse>("/api/v1/user/me");
  }

  async getUserById(id: string): Promise<GetUserResponse> {
    return this.requestWithAuth<GetUserResponse>(`/api/v1/user/${id}`);
  }

  async getUserByLicenseId(pilotLicenseId: string): Promise<GetUserResponse> {
    const users = await this.requestWithAuth<ListUsersResponse>(
      `/api/v1/user?pilotLicenseId=${pilotLicenseId}`,
    );

    if (users.length !== 1) {
      return Promise.reject(users);
    }

    return users[0];
  }
}
