import {UserRole} from "~/models/user.model";

export type JwtTokenPayload = {
  exp: number
  iat: number
  role: UserRole,
  sub: string,
  name: string,
  email: string
}