import type { AuthClient } from "~/features/auth/model";
import { toHuman } from "~/i18n/translate";

type ClientIdentity = {
  client: AuthClient;
  deviceName: string | null;
};

export function describeAuthClient({ client, deviceName }: ClientIdentity): string {
  const label = toHuman.auth.client(client);

  return deviceName === null ? label : `${label} on ${deviceName}`;
}
