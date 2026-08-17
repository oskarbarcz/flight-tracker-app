import { Button } from "flowbite-react";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { DiscordAvatar } from "~/features/auth/components/DiscordAvatar";
import type { DiscordMembershipState } from "~/features/auth/lib/discordFeatures";
import type { DiscordIdentity } from "~/features/user";

type Props = {
  identity: DiscordIdentity;
  membership: DiscordMembershipState;
  inviteUrl: string | null;
  onDisconnect: () => void;
};

function Membership({ membership, inviteUrl }: { membership: DiscordMembershipState; inviteUrl: string | null }) {
  if (membership === "member") {
    return (
      <p className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
        <FaCircleCheck aria-hidden className="size-3.5 shrink-0 text-green-700 dark:text-green-400" />
        In the MyPreflight server
      </p>
    );
  }

  if (membership === "not_member") {
    return (
      <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-gray-600 dark:text-gray-300">
        <FaCircleExclamation aria-hidden className="size-3.5 shrink-0 text-amber-700 dark:text-amber-400" />
        Not in the MyPreflight server
        {inviteUrl !== null && (
          <a
            href={inviteUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400"
          >
            Join
          </a>
        )}
      </p>
    );
  }

  if (membership === "checking") {
    return <p className="text-xs text-gray-500 dark:text-gray-400">Checking the MyPreflight server…</p>;
  }

  return null;
}

export function DiscordAccountHeader({ identity, membership, inviteUrl, onDisconnect }: Props) {
  const name = identity.globalName ?? identity.username ?? null;
  const login = identity.username ?? null;
  const showLogin = login !== null && login !== name;

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3.5">
        <DiscordAvatar identity={identity} />

        <div className="min-w-0 space-y-0.5">
          {name !== null && (
            <p className="truncate text-base font-bold leading-tight text-gray-900 dark:text-white">{name}</p>
          )}
          {showLogin && <p className="truncate font-mono text-xs text-gray-500 dark:text-gray-400">{login}</p>}
          <Membership membership={membership} inviteUrl={inviteUrl} />
        </div>
      </div>

      <Button color="lightDanger" size="xs" className="shrink-0 px-3.5" onClick={onDisconnect}>
        Disconnect
      </Button>
    </div>
  );
}
