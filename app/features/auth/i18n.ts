import { AuthClient } from "~/features/auth/model";

export function translateAuthClient(client: AuthClient): string {
  switch (client) {
    case AuthClient.Web:
      return "Browser";
    case AuthClient.Transponder:
      return "Transponder";
  }
}
