import type { GoogleSignInRequest } from "~/features/auth";
import type { UserStats } from "~/features/user";
import type { GetUserResponse, ListUsersResponse } from "~/features/user/request";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

export class UserService extends AbstractAuthorizedApiService {
  async fetchCurrent() {
    return this.fetchWithAuth<GetUserResponse>("/api/v1/user/me");
  }

  async linkGoogleAccount(idToken: string) {
    const body: GoogleSignInRequest = { idToken };

    await this.fetchWithAuth<void>("/api/v1/user/me/link-google-account", {
      method: "POST",
      body: JSON.stringify(body),
    });
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
