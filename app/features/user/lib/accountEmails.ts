import type { User } from "~/features/user/model";

export function pendingEmail(user: User): string | null {
  return user.emails.find((entry) => !entry.active)?.email ?? null;
}
