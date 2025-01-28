import { User } from "~/models/user.model";
import { JwtTokenPayload } from "~/models";

function parseJwt(token: string): JwtTokenPayload {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload) as JwtTokenPayload;
}

export function getUserFromToken(token: string): User {
  const jwtPayload = parseJwt(token);

  return {
    id: jwtPayload.sub,
    name: jwtPayload.name,
    email: jwtPayload.email,
    role: jwtPayload.role,
    session: jwtPayload.session,
  };
}
