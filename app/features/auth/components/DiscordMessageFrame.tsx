import type React from "react";
import { FaRegFilePdf } from "react-icons/fa6";
import logo from "~/assets/logo.svg";

type FrameProps = {
  label: string;
  children: React.ReactNode;
};

type MessageProps = {
  sentAt: string;
  children: React.ReactNode;
};

export function DiscordMessageFrame({ label, children }: FrameProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className="pointer-events-none select-none space-y-4 overflow-hidden rounded-xl bg-discord-chat p-4 ring-1 ring-gray-900/10 dark:ring-white/10"
    >
      {children}
    </div>
  );
}

export function DiscordMessage({ sentAt, children }: MessageProps) {
  return (
    <div className="flex gap-3">
      <img src={logo} alt="" className="size-10 shrink-0 rounded-full bg-white p-2" />

      <div className="min-w-0 flex-1 space-y-2 text-sm leading-relaxed text-discord-text">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-bold text-discord-name">Flight Tracker</span>
          <span className="rounded bg-discord px-1 py-px text-xs font-semibold uppercase leading-4 tracking-wide text-white">
            App
          </span>
          <span className="text-xs text-discord-muted">{sentAt}</span>
        </p>

        {children}
      </div>
    </div>
  );
}

export function MessageHeading({ children }: { children: React.ReactNode }) {
  return <p className="font-bold text-discord-name">{children}</p>;
}

export function MessageCodeBlock({ children }: { children: string }) {
  return (
    <pre className="whitespace-pre-wrap rounded border border-discord-edge bg-discord-panel px-2.5 py-2 font-mono text-xs leading-relaxed text-discord-text">
      {children}
    </pre>
  );
}

export function MessageValue({ children }: { children: React.ReactNode }) {
  return <span className="font-bold text-discord-name">{children}</span>;
}

function MessageLink({ children }: { children: string }) {
  return <span className="text-discord-link">{children}</span>;
}

export function MessageManageLine({ action }: { action: string }) {
  return (
    <p>
      {action} the <img src={logo} alt="" className="inline size-4 align-text-bottom" />{" "}
      <MessageValue>
        <MessageLink>Flight Tracker app</MessageLink>
      </MessageValue>
      .
    </p>
  );
}

export function MessageAttachment({ fileName, size }: { fileName: string; size: string }) {
  return (
    <div className="flex w-fit max-w-full items-center gap-3 rounded-lg border border-discord-edge bg-discord-panel px-3 py-2.5">
      <FaRegFilePdf aria-hidden className="size-7 shrink-0 text-discord-muted" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-discord-link">{fileName}</p>
        <p className="text-xs text-discord-muted">{size}</p>
      </div>
    </div>
  );
}
