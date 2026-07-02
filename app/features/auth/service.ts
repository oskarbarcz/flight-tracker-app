import type { SignInRequest, SignInResponse } from "~/features/auth";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

export class AuthService extends AbstractAuthorizedApiService {
  async signIn(credentials: SignInRequest) {
    return this.request<SignInResponse>("/api/v1/auth/sign-in", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async signOut() {
    await this.fetchWithAuth<void>("/api/v1/auth/sign-out", {
      method: "POST",
    });
  }
}
