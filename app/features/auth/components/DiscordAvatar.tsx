import { useState } from "react";
import { FaDiscord } from "react-icons/fa6";
import type { DiscordIdentity } from "~/features/user";

type Props = {
  identity: DiscordIdentity;
};

export function DiscordAvatar({ identity }: Props) {
  const [avatarFailed, setAvatarFailed] = useState<boolean>(false);
  const showAvatar = typeof identity.avatarUrl === "string" && identity.avatarUrl.length > 0 && !avatarFailed;

  if (!showAvatar) {
    return (
      <span className="flex size-11 items-center justify-center rounded-full bg-discord/10 text-discord ring-2 ring-discord dark:bg-discord/20 dark:text-discord-light dark:ring-discord-light">
        <FaDiscord aria-hidden size={22} />
      </span>
    );
  }

  return (
    <img
      src={identity.avatarUrl ?? undefined}
      alt=""
      onError={() => setAvatarFailed(true)}
      className="size-11 rounded-full bg-gray-200 object-cover ring-2 ring-discord dark:bg-gray-700 dark:ring-discord-light"
    />
  );
}
