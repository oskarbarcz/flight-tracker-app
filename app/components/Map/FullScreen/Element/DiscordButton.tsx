import { Button, Tooltip } from "flowbite-react";
import { Link } from "react-router";
import { FaDiscord } from "react-icons/fa6";
import { useAppConfig } from "~/state/hooks/useAppConfig";

export default function DiscordButton() {
  const { discordInvitationHash } = useAppConfig();

  return (
    <Tooltip
      content="Join our Discord community"
      style="auto"
      placement="bottom"
    >
      <Button
        color="alternative"
        size="sm"
        as={Link}
        target="_blank"
        to={`https://discord.gg/${discordInvitationHash}`}
      >
        <FaDiscord size={18} />
      </Button>
    </Tooltip>
  );
}
