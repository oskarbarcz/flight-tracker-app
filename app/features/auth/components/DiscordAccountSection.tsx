import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaCircleExclamation, FaCircleInfo, FaDiscord } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { DisconnectAccountModal } from "~/features/auth/components/DisconnectAccountModal";
import { DiscordConnectionCard } from "~/features/auth/components/DiscordConnectionCard";
import { DiscordIntegrationModal } from "~/features/auth/components/DiscordIntegrationModal";
import { DiscordSettingsModal } from "~/features/auth/components/DiscordSettingsModal";
import { startDiscordFlow } from "~/features/auth/lib/discordAuthorization";
import type { DiscordMembershipState } from "~/features/auth/lib/discordFeatures";
import { readDiscordHandoff } from "~/features/auth/lib/discordHandoff";
import type { DiscordIdentity, DiscordJoinOutcome } from "~/features/user";
import { useApi } from "~/shared/api/useApi";
import { useAppEnvironment } from "~/shared/hooks/useAppEnvironment";
import { getDiscordClientId } from "~/shared/lib/getDiscordClientId";
import { RecordNote } from "~/shared/ui/Record/RecordNote";
import { RecordRow } from "~/shared/ui/Record/RecordRow";

type Dialog = "none" | "settings" | "integration" | "disconnect";

const explanation =
  "Connect a Discord account to sign in with Discord, and to receive your flight briefings as Discord direct messages.";
const disconnectConsequences = [
  "Signing in with Discord will stop working.",
  "Flight briefings will no longer arrive as Discord direct messages.",
  "You will stay a member of the Flight Tracker Discord server.",
];

const joinOutcomeLead: Partial<Record<DiscordJoinOutcome, string>> = {
  joined: "You have been added to the Flight Tracker server.",
  already_member: "You are already in the Flight Tracker server.",
  failed: "You could not be added to the Flight Tracker server.",
};

export function DiscordAccountSection() {
  const { user, refreshUser } = useAuth();
  const { userService } = useApi();
  const { discordInvitationHash } = useAppEnvironment();
  const location = useLocation();
  const navigate = useNavigate();

  const [linkedNow, setLinkedNow] = useState<DiscordIdentity | null>(null);
  const [joinOutcome, setJoinOutcome] = useState<DiscordJoinOutcome | null>(null);
  const [leaving, setLeaving] = useState<boolean>(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [blocked, setBlocked] = useState<string | null>(null);
  const [membership, setMembership] = useState<DiscordMembershipState>("checking");
  const [dialog, setDialog] = useState<Dialog>("none");

  const identity = linkedNow ?? user?.identities?.discord ?? null;
  const isConnected = identity?.linked === true;
  const inviteUrl = discordInvitationHash ? `https://discord.gg/${discordInvitationHash}` : null;

  useEffect(() => {
    const handoff = readDiscordHandoff(location.state);

    if (handoff === null) {
      return;
    }

    if (handoff.failure !== undefined) {
      setFailure(handoff.failure);
    }

    if (handoff.link !== undefined) {
      setLinkedNow(handoff.link);
      setJoinOutcome(handoff.link.joinOutcome);
      refreshUser().catch(() => undefined);
    }

    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.state, navigate, refreshUser]);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    let active = true;
    setMembership("checking");

    userService
      .fetchDiscordServerMembership()
      .then(({ status }) => {
        if (active) {
          setMembership(status);
        }
      })
      .catch(() => {
        if (active) {
          setMembership("unknown");
        }
      });

    return () => {
      active = false;
    };
  }, [isConnected, userService]);

  if (getDiscordClientId() === null) {
    return null;
  }

  function connect(joinServer: boolean) {
    if (leaving) {
      return;
    }

    setDialog("none");
    setLeaving(true);
    setFailure(null);
    startDiscordFlow("link", joinServer).catch(() => setLeaving(false));
  }

  function forget() {
    setLinkedNow(null);
    setJoinOutcome(null);
    setDialog("none");
    refreshUser().catch(() => undefined);
  }

  return (
    <RecordRow
      label="Discord"
      action={
        isConnected ? (
          <Button
            color="light"
            size="sm"
            className="min-h-10 w-full sm:w-auto"
            onClick={() => setDialog("integration")}
          >
            Manage integration
          </Button>
        ) : (
          <Button
            color="light"
            size="sm"
            onClick={() => setDialog("settings")}
            aria-disabled={leaving}
            className={`min-h-10 w-full sm:w-auto ${leaving ? "pointer-events-none opacity-60" : ""}`}
          >
            <FaDiscord aria-hidden size={16} className="me-2 text-discord dark:text-discord-light" />
            {leaving ? "Opening Discord…" : "Connect"}
          </Button>
        )
      }
      detail={
        isConnected && identity !== null ? (
          <DiscordConnectionCard
            identity={identity}
            membership={membership}
            lead={joinOutcome === null ? null : (joinOutcomeLead[joinOutcome] ?? null)}
          />
        ) : undefined
      }
    >
      {!isConnected && <RecordNote>{explanation}</RecordNote>}

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

      {dialog === "settings" && <DiscordSettingsModal close={() => setDialog("none")} onContinue={connect} />}

      {dialog === "integration" && identity !== null && (
        <DiscordIntegrationModal
          identity={identity}
          membership={membership}
          inviteUrl={inviteUrl}
          close={() => setDialog("none")}
          onDisconnect={() => setDialog("disconnect")}
        />
      )}

      {dialog === "disconnect" && (
        <DisconnectAccountModal
          provider="Discord"
          consequences={disconnectConsequences}
          disconnect={(currentPassword) => userService.unlinkDiscordAccount(currentPassword)}
          close={() => setDialog("none")}
          onDisconnected={forget}
          onBlocked={(message) => {
            setBlocked(message);
            setDialog("none");
          }}
          onAbsent={forget}
        />
      )}
    </RecordRow>
  );
}
