export type SignInRequest = {
  email: string;
  password: string;
};

export type GoogleSignInRequest = {
  idToken: string;
};

export type DiscordAuthorizationRequest = {
  code: string;
  redirectUri: string;
  codeVerifier: string;
};

export type SignInResponse = {
  accessToken: string;
  refreshToken: string;
};

export enum AuthClient {
  Web = "web",
  Transponder = "transponder",
}

export type DeviceSignIn = {
  userCode: string;
  client: AuthClient;
  deviceName: string | null;
  createdAt: string;
  expiresAt: string;
};

export type AuthSession = {
  id: string;
  client: AuthClient;
  deviceName: string | null;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  current: boolean;
};
