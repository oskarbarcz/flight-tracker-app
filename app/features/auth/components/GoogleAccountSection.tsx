import { Badge, Button } from "flowbite-react";
import { useState } from "react";
import { FaCircleExclamation, FaCircleInfo } from "react-icons/fa6";
import { useAuth } from "~/app-state/useAuth";
import { DisconnectAccountModal } from "~/features/auth/components/DisconnectAccountModal";
import { useGoogleIdentity } from "~/features/auth/hooks/useGoogleIdentity";
import { describeGoogleLinkFailure } from "~/features/auth/lib/describeGoogleFailure";
import { useApi } from "~/shared/api/useApi";
import { RecordNote } from "~/shared/ui/Record/RecordNote";
import { RecordRow } from "~/shared/ui/Record/RecordRow";

const explanation = "Connect a Google account to sign in with Google instead of your email and password.";
const disconnectConsequences = ["Signing in with Google will stop working."];

export function GoogleAccountSection() {
  const { user, refreshUser } = useAuth();
  const { userService } = useApi();
  const [connectedNow, setConnectedNow] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [blocked, setBlocked] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const identity = user?.identities?.google ?? null;
  const isConnected = connectedNow || identity?.linked === true;
  const connectedEmail = isConnected ? (identity?.email ?? null) : null;

  function connect(idToken: string) {
    if (connecting) {
      return;
    }

    setConnecting(true);
    setFailure(null);

    userService
      .linkGoogleAccount(idToken)
      .then(() => {
        setConnectedNow(true);
        return refreshUser();
      })
      .catch((reason) => setFailure(describeGoogleLinkFailure(reason)))
      .finally(() => setConnecting(false));
  }

  const { containerRef, status } = useGoogleIdentity({ text: "continue_with", onCredential: connect });

  if (status === "unconfigured") {
    return null;
  }

  if (!isConnected && status === "unavailable") {
    return null;
  }

  function forget() {
    setConnectedNow(false);
    setIsModalOpen(false);
    refreshUser().catch(() => undefined);
  }

  const awaitingControl = !isConnected && status !== "ready";

  return (
    <RecordRow
      label="Google sign-in"
      className={awaitingControl ? "opacity-0" : undefined}
      action={
        isConnected ? (
          <Button color="light" size="sm" className="min-h-10 w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
            Disconnect
          </Button>
        ) : (
          <div
            ref={containerRef}
            aria-busy={connecting}
            className={`flex min-h-10 justify-center sm:w-56 ${connecting ? "pointer-events-none opacity-60" : ""}`}
          />
        )
      }
    >
      {isConnected ? (
        <div className="flex flex-wrap items-center gap-2">
          <Badge color="success" size="sm">
            Connected
          </Badge>
          {connectedEmail !== null && (
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{connectedEmail}</span>
          )}
        </div>
      ) : (
        <RecordNote>{explanation}</RecordNote>
      )}

      {blocked !== null && (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-pretty text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <FaCircleInfo aria-hidden className="mt-0.5 shrink-0" />
          <span>{blocked}</span>
        </p>
      )}

      {failure !== null && (
        <p
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-pretty text-sm text-red-700 dark:border-red-900 dark:bg-red-900/40 dark:text-red-300"
        >
          <FaCircleExclamation aria-hidden className="mt-0.5 shrink-0" />
          <span>{failure}</span>
        </p>
      )}

      {isModalOpen && (
        <DisconnectAccountModal
          provider="Google"
          consequences={disconnectConsequences}
          disconnect={(currentPassword) => userService.unlinkGoogleAccount(currentPassword)}
          close={() => setIsModalOpen(false)}
          onDisconnected={forget}
          onBlocked={(message) => {
            setBlocked(message);
            setIsModalOpen(false);
          }}
          onAbsent={forget}
        />
      )}
    </RecordRow>
  );
}
