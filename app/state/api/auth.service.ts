import { AbstractAuthorizedApiService } from "~/state/api/api.service";
import { SignInRequest, SignInResponse } from "~/models";

export class AuthService extends AbstractAuthorizedApiService {
  async signIn(credentials: SignInRequest): Promise<SignInResponse> {
    return this.request<SignInResponse>("/api/v1/auth/sign-in", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async signOut(): Promise<void> {
    await this.requestWithAuth<void>("/api/v1/auth/sign-out", {
      method: "POST",
    });
  }
}
