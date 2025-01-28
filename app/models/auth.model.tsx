import { UserRole } from "~/models/user.model";

export type JwtTokenPayload = {
  exp: number;
  iat: number;
  role: UserRole;
  sub: string;
  name: string;
  email: string;
  session: string;
  type: string;
};

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignInResponse = {
  accessToken: string;
  refreshToken: string;
};
