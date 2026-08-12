import { Button } from "flowbite-react";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa6";
import { startDiscordFlow } from "~/features/auth/lib/discordAuthorization";

type Props = {
  blocked: boolean;
};

export function DiscordSignInButton({ blocked }: Props) {
  const [leaving, setLeaving] = useState<boolean>(false);
  const unavailable = blocked || leaving;

  function start() {
    if (unavailable) {
      return;
    }

    setLeaving(true);
    startDiscordFlow("signin").catch(() => setLeaving(false));
  }

  return (
    <Button
      type="button"
      color="alternative"
      onClick={start}
      aria-disabled={unavailable}
      className={`min-h-10 w-full rounded-full border-gray-300 font-medium ${
        unavailable ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <FaDiscord aria-hidden size={18} className="me-2 text-discord dark:text-discord-light" />
      {leaving ? "Opening Discord…" : "Sign in with Discord"}
    </Button>
  );
}
