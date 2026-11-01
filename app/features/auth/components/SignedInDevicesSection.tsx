import { SignedInDevicesPanel } from "~/features/auth/components/SignedInDevicesPanel";
import { useAuthSessions } from "~/features/auth/hooks/useAuthSessions";

export function SignedInDevicesSection() {
  const devices = useAuthSessions();

  return <SignedInDevicesPanel devices={devices} />;
}
