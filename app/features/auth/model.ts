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
