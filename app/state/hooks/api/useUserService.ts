import { UserService } from "~/state/api/user.service";

const userService = new UserService();

export function useUserService(): UserService {
  return userService;
}
