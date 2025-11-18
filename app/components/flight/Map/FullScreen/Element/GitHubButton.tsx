import { Button, Tooltip } from "flowbite-react";
import { FaGithub } from "react-icons/fa6";
import { Link } from "react-router";

export default function GitHubButton() {
  const button = (
    <Button
      color="alternative"
      size="sm"
      target="_blank"
      as={Link}
      to="https://github.com/oskarbarcz/flight-tracker-app"
    >
      <FaGithub size={18} />
    </Button>
  );

  return (
    <>
      <div className="hidden md:block">
        <Tooltip
          content="See project repository"
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
