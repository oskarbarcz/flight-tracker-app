import {UserRole} from "~/models/user.model";

export type JwtTokenPayload = {
  exp: number
  iat: number
  role: UserRole,
  sub: string,
  username: string
}