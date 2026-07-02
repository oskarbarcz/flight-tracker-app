import type { GetUserResponse, ListUsersResponse } from "~/features/user/request";
import type { UserStats } from "~/models";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

export class UserService extends AbstractAuthorizedApiService {
  async fetchCurrent() {
    return this.fetchWithAuth<GetUserResponse>("/api/v1/user/me");
  }

  async fetchUserStats() {
    return this.fetchWithAuth<UserStats>("/api/v1/user/me/stats");
  }

  async fetchUserById(id: string) {
    return this.fetchWithAuth<GetUserResponse>(`/api/v1/user/${id}`);
  }

  async fetchUserByLicenseId(pilotLicenseId: string) {
    const users = await this.fetchWithAuth<ListUsersResponse>(`/api/v1/user?pilotLicenseId=${pilotLicenseId}`);

    if (users.length !== 1) {
      return Promise.reject(users);
    }

    return users[0];
  }
}
