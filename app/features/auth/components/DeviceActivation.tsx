import { useSearchParams } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { DeviceActivationCard } from "~/features/auth/components/DeviceActivationCard";
import { useDeviceActivation } from "~/features/auth/hooks/useDeviceActivation";
import { formatUserCode, normalizeUserCode } from "~/features/auth/lib/deviceUserCode";

const userCodeParam = "code";

export function DeviceActivation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const normalized = normalizeUserCode(searchParams.get(userCodeParam));
  const userCode = normalized === null ? null : formatUserCode(normalized);
  const { state, retry, decide } = useDeviceActivation(userCode);

  if (user === null) {
    return null;
  }

  return (
    <DeviceActivationCard
      state={state}
      account={user.email}
      onSubmitCode={(code) => setSearchParams({ [userCodeParam]: code })}
      onDecide={decide}
      onRetry={retry}
      onEnterAnotherCode={() => setSearchParams({})}
    />
  );
}
