import type {
  DeviceSignIn,
  DiscordAuthorizationRequest,
  GoogleSignInRequest,
  SignInRequest,
  SignInResponse,
} from "~/features/auth";
import { AbstractAuthorizedApiService } from "~/shared/api/api.service";

function deviceSignInPath(userCode: string): string {
  return `/api/v1/auth/device/${encodeURIComponent(userCode)}`;
}

export class AuthService extends AbstractAuthorizedApiService {
  async signIn(credentials: SignInRequest) {
    return this.request<SignInResponse>("/api/v1/auth/sign-in", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async signInWithGoogle(idToken: string) {
    const body: GoogleSignInRequest = { idToken };

    return this.request<SignInResponse>("/api/v1/auth/google", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async signInWithDiscord(authorization: DiscordAuthorizationRequest) {
    return this.request<SignInResponse>("/api/v1/auth/discord", {
      method: "POST",
      body: JSON.stringify(authorization),
    });
  }

  async signOut() {
    await this.fetchWithAuth<void>("/api/v1/auth/sign-out", {
      method: "POST",
    });
  }

  async fetchDeviceSignIn(userCode: string) {
    return this.fetchWithAuth<DeviceSignIn>(deviceSignInPath(userCode));
  }

  async approveDeviceSignIn(userCode: string) {
    await this.fetchWithAuth<void>(`${deviceSignInPath(userCode)}/approve`, {
      method: "POST",
    });
  }

  async denyDeviceSignIn(userCode: string) {
    await this.fetchWithAuth<void>(`${deviceSignInPath(userCode)}/deny`, {
      method: "POST",
    });
  }
}
