import { AuthService } from "~/state/api/auth.service";

const authService = new AuthService();

export function useAuthService(): AuthService {
  return authService;
}
