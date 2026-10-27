import { Button, Tooltip } from "flowbite-react";
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

  const openLabel = "Open full-screen tracking in new tab";
  const copyLabel = copied ? "Tracking link copied" : "Copy tracking link to clipboard";

  return (
    <div className="flex gap-2">
      <Tooltip content={openLabel} style="auto">
        <Button
          as={Link}
          to={`/map/${flightId}`}
          aria-label={openLabel}
          target="_blank"
          size="xs"
          color="light"
          className="pointer-coarse:size-11"
        >
          <LuExternalLink aria-hidden={true} />
        </Button>
      </Tooltip>
      <Tooltip content={copyLabel} style="auto">
        <Button size="xs" aria-label={copyLabel} color="light" onClick={handleCopy} className="pointer-coarse:size-11">
          <IconSwap current={copied ? "copied" : "idle"} icons={{ idle: <LuLink />, copied: <LuCheck /> }} />
        </Button>
      </Tooltip>
      <span role="status" className="sr-only">
        {copied ? "Tracking link copied" : ""}
      </span>
    </div>
  );
}
