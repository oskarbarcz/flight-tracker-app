import type { GoogleSignInRequest } from "~/features/auth";
import type { UserStats } from "~/features/user";
import type {
  ChangePasswordRequest,
  ConfirmEmailChangeRequest,
  DiscordServerMembershipResponse,
  DiscordSettingsResponse,
  GetUserResponse,
  LinkDiscordAccountRequest,
  LinkDiscordAccountResponse,
  ListUsersResponse,
  RequestEmailChangeRequest,
  UnlinkAccountRequest,
  UpdateDiscordSettingsRequest,
  UpdateOwnProfileRequest,
  VerifySimbriefUserResponse,
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

  async verifySimbriefUser(simbriefUserId: string) {
    return this.fetchWithAuth<VerifySimbriefUserResponse>(
      `/api/v1/user/simbrief/${encodeURIComponent(simbriefUserId)}`,
    );
  }

  async linkGoogleAccount(idToken: string) {
    const body: GoogleSignInRequest = { idToken };

    await this.fetchWithAuth<void>("/api/v1/user/me/link-google-account", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async unlinkGoogleAccount(currentPassword: string) {
    const body: UnlinkAccountRequest = { currentPassword };

    await this.fetchWithAuthWithoutRetry<void>("/api/v1/user/me/unlink-google-account", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async linkDiscordAccount(authorization: LinkDiscordAccountRequest) {
    return this.fetchWithAuth<LinkDiscordAccountResponse>("/api/v1/user/me/link-discord-account", {
      method: "POST",
      body: JSON.stringify(authorization),
    });
  }

  async unlinkDiscordAccount(currentPassword: string) {
    const body: UnlinkAccountRequest = { currentPassword };

    await this.fetchWithAuthWithoutRetry<void>("/api/v1/user/me/unlink-discord-account", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async fetchDiscordServerMembership() {
    return this.fetchWithAuth<DiscordServerMembershipResponse>("/api/v1/user/me/discord/server-membership");
  }

  async fetchDiscordSettings() {
    return this.fetchWithAuth<DiscordSettingsResponse>("/api/v1/user/me/discord-settings");
  }

  async updateDiscordSettings(settings: UpdateDiscordSettingsRequest) {
    return this.fetchWithAuth<DiscordSettingsResponse>("/api/v1/user/me/discord-settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
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
