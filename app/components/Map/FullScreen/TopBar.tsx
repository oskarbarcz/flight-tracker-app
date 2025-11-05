import logo from "~/assets/logo.svg";
import { FaDiscord, FaGithub } from "react-icons/fa6";
import { Button, Tooltip } from "flowbite-react";
import { Link } from "react-router";
import { useAppConfig } from "~/state/hooks/useAppConfig";

export default function TopBar() {
  const { discordInvitationHash } = useAppConfig();

  return (
    <nav className="mb-2 py-2 px-4 w-full flex justify-between">
      <div className="flex items-center">
        <img src={logo} className="h-6 mr-2" alt="FlightTracker app logo" />
        <span className="text-xl font-bold text-indigo-500">
          Flight Tracker
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="block w-[1px] h-[calc(100%-6px)] bg-gray-300 dark:bg-gray-800"></span>
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
        <Tooltip
          content="See project repository"
          style="auto"
          placement="bottom"
        >
          <Button
            color="alternative"
            size="sm"
            target="_blank"
            as={Link}
            to="https://github.com/oskarbarcz/flight-tracker-app"
          >
            <FaGithub size={18} />
          </Button>
        </Tooltip>
      </div>
    </nav>
  );
}
