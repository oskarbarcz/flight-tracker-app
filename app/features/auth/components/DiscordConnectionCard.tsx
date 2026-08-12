import { useState } from "react";
import { FaCheck, FaDiscord, FaExclamation } from "react-icons/fa6";
import { type DiscordMembershipState, membershipNote } from "~/features/auth/lib/discordFeatures";
import type { DiscordIdentity } from "~/features/user";

type Props = {
  identity: DiscordIdentity;
  membership: DiscordMembershipState;
  lead?: string | null;
};

type Marker = { tone: string; Icon: typeof FaCheck | null; label: string };

const markers: Record<DiscordMembershipState, Marker> = {
  member: {
    tone: "bg-green-700 dark:bg-green-400",
    Icon: FaCheck,
    label: "Connected, and in the Flight Tracker server",
  },
  unknown: {
    tone: "bg-green-700 dark:bg-green-400",
    Icon: FaCheck,
    label: "Discord account connected",
  },
  not_member: {
    tone: "bg-amber-700 dark:bg-amber-400",
    Icon: FaExclamation,
    label: "Connected, but not in the Flight Tracker server",
  },
  checking: {
    tone: "bg-gray-300 dark:bg-gray-600",
    Icon: null,
    label: "Checking the Discord connection",
  },
};

export function DiscordConnectionCard({ identity, membership, lead }: Props) {
  const [avatarFailed, setAvatarFailed] = useState<boolean>(false);
  const { tone, Icon, label } = markers[membership];

  const name = identity.globalName ?? identity.username ?? null;
  const login = identity.username ?? null;
  const showLogin = login !== null && login !== name;
  const showAvatar = typeof identity.avatarUrl === "string" && identity.avatarUrl.length > 0 && !avatarFailed;
  const note = [lead, membershipNote[membership]].filter(Boolean).join(" ") || null;

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/60">
      <div className="flex items-center gap-3.5">
        <div className="relative shrink-0">
          {showAvatar ? (
            <img
              src={identity.avatarUrl ?? undefined}
              alt=""
              onError={() => setAvatarFailed(true)}
              className="size-11 rounded-full bg-gray-200 object-cover ring-2 ring-discord dark:bg-gray-700 dark:ring-discord-light"
            />
          ) : (
            <span className="flex size-11 items-center justify-center rounded-full bg-discord/10 text-discord ring-2 ring-discord dark:bg-discord/20 dark:text-discord-light dark:ring-discord-light">
              <FaDiscord aria-hidden size={22} />
            </span>
          )}

          <span
            className={`absolute -bottom-0.5 -end-0.5 flex size-[18px] items-center justify-center rounded-full ring-2 ring-gray-50 dark:ring-gray-900 ${tone}`}
          >
            {Icon && <Icon aria-hidden className="size-2.5 text-white dark:text-gray-900" />}
            <span className="sr-only">{label}</span>
          </span>
        </div>

        <div className="min-w-0 flex-1">
          {name !== null && (
            <p className="truncate text-base font-bold leading-tight text-gray-900 dark:text-white">{name}</p>
          )}
          {showLogin && <p className="truncate font-mono text-xs text-gray-500 dark:text-gray-400">{login}</p>}
        </div>
      </div>

      {note !== null && (
        <p className="mt-3 border-t border-gray-200 pt-3 text-pretty text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
          {note}
        </p>
      )}
    </div>
  );
}
