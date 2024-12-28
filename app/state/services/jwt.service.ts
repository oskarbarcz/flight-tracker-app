import {JwtTokenPayload} from "~/models/jwt.model";
import {User} from "~/models/user.model";

export const JwtService = {
  parseJwt: (token: string): JwtTokenPayload => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload) as JwtTokenPayload;
  },

  getUserFromToken: (token: string): User => {
    const jwtPayload = JwtService.parseJwt(token);

    return {
      id: jwtPayload.sub,
      name: jwtPayload.name,
      email: jwtPayload.email,
      role: jwtPayload.role,
    };
  }
}