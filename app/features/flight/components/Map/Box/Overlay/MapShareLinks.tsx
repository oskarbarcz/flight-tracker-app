import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { LuCheck, LuExternalLink, LuLink } from "react-icons/lu";
import { Link } from "react-router";
import { IconSwap } from "~/shared/ui/Display/IconSwap";

const COPIED_FEEDBACK_MS = 2000;

type Props = {
  flightId: string;
};

export function MapShareLinks({ flightId }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const reset = window.setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
    return () => window.clearTimeout(reset);
  }, [copied]);

  const handleCopy = () => {
    const trackingUrl = `${window.location.origin}/map/${flightId}`;
    navigator.clipboard.writeText(trackingUrl).then(() => setCopied(true));
  };

  const copyLabel = copied ? "Tracking link copied" : "Copy tracking link to clipboard";

  return (
    <div className="flex gap-2">
      <Button
        as={Link}
        to={`/map/${flightId}`}
        title="Open full-screen tracking in new tab"
        aria-label="Open full-screen tracking in new tab"
        target="_blank"
        size="xs"
        color="light"
      >
        <LuExternalLink aria-hidden={true} />
      </Button>
      <Button size="xs" title={copyLabel} aria-label={copyLabel} color="light" onClick={handleCopy}>
        <IconSwap current={copied ? "copied" : "idle"} icons={{ idle: <LuLink />, copied: <LuCheck /> }} />
      </Button>
      <span role="status" className="sr-only">
        {copied ? "Tracking link copied" : ""}
      </span>
    </div>
  );
}
