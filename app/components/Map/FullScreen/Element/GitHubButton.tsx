import { Button, Tooltip } from "flowbite-react";
import { Link } from "react-router";
import { FaGithub } from "react-icons/fa6";

export default function GitHubButton() {
  return (
    <Tooltip content="See project repository" style="auto" placement="bottom">
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
  );
}
