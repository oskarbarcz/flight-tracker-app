import { Button } from "flowbite-react";
import { IoIosLink } from "react-icons/io";
import { LuExternalLink } from "react-icons/lu";
import { Link } from "react-router";

type Props = {
  flightId: string;
};

export function MapShareLinks({ flightId }: Props) {
  const handleCopy = () => {
    const trackingUrl = `${window.location.origin}/map/${flightId}`;
    navigator.clipboard.writeText(trackingUrl).then();
  };

  return (
    <div className="flex gap-2">
      <Button
        as={Link}
        to={`/map/${flightId}`}
        title="Open full-screen tracking in new tab"
        target="_blank"
        size="xs"
        color="light"
      >
        <LuExternalLink />
      </Button>
      <Button size="xs" title="Copy tracking link to clipboard" color="light" onClick={handleCopy}>
        <IoIosLink />
      </Button>
    </div>
  );
}
