"use client";

import { Button } from "flowbite-react";
import { IoIosLink } from "react-icons/io";
import { LuExternalLink } from "react-icons/lu";
import { Link } from "react-router";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";

export default function MapLinkOverlay() {
  const { flight } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  const handleCopy = () => {
    const baseUrl = window.location.origin;
    const trackingUrl = `${baseUrl}/live-tracking/${flight.id}`;
    navigator.clipboard.writeText(trackingUrl).then();
  };

  return (
    <div className="absolute top-3 right-3 flex gap-3">
      <Button
        as={Link}
        to={`/live-tracking/${flight.id}`}
        title="Open full-screen tracking in new tab"
        target="_blank"
        size="xs"
        color="light"
      >
        <LuExternalLink />
      </Button>
      <Button
        size="xs"
        title="Copy tracking link to clipboard"
        color="light"
        onClick={handleCopy}
      >
        <IoIosLink />
      </Button>
    </div>
  );
}
