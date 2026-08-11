import type { GoogleSignInRequest } from "~/features/auth";
import type { UserStats } from "~/features/user";
import type {
  ChangePasswordRequest,
  ConfirmEmailChangeRequest,
  GetUserResponse,
  ListUsersResponse,
  RequestEmailChangeRequest,
  UpdateOwnProfileRequest,
} from "~/features/user/request";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

export class UserService extends AbstractAuthorizedApiService {
  async fetchCurrent() {
    return this.fetchWithAuth<GetUserResponse>("/api/v1/user/me");
  }

  async updateOwnProfile(profile: UpdateOwnProfileRequest) {
    return this.fetchWithAuth<GetUserResponse>("/api/v1/user/me", {
      method: "PATCH",
      body: JSON.stringify(profile),
    });
  }

  async linkGoogleAccount(idToken: string) {
    const body: GoogleSignInRequest = { idToken };

    await this.fetchWithAuth<void>("/api/v1/user/me/link-google-account", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const body: ChangePasswordRequest = { currentPassword, newPassword };

    await this.fetchWithAuthWithoutRetry<void>("/api/v1/user/me/change-password", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async requestEmailChange(newEmail: string, currentPassword: string) {
    const body: RequestEmailChangeRequest = { newEmail, currentPassword };

    await this.fetchWithAuthWithoutRetry<void>("/api/v1/user/me/change-email", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async confirmEmailChange(token: string) {
    const body: ConfirmEmailChangeRequest = { token };

    await this.request<void>("/api/v1/user/me/change-email/confirm", {
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
