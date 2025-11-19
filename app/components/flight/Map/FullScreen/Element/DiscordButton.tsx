import { Button, Tooltip } from "flowbite-react";
import { FaDiscord } from "react-icons/fa6";
import { Link } from "react-router";
import { useAppConfig } from "~/state/hooks/useAppConfig";

export default function DiscordButton() {
  const { discordInvitationHash } = useAppConfig();

  const button = (
    <Button
      color="alternative"
      size="sm"
      as={Link}
      target="_blank"
      to={`https://discord.gg/${discordInvitationHash}`}
    >
      <FaDiscord size={18} />
    </Button>
  );

  return (
    <>
      <div className="hidden md:block">
        <Tooltip
          content="Join our Discord community"
          style="auto"
          placement="bottom"
        >
          {button}
        </Tooltip>
      </div>

      <div className="md:hidden">{button}</div>
    </>
  );
}
