import React from "react";
import { RecordValue } from "~/shared/ui/Record/RecordValue";

type StepState = "done" | "waiting";

type StepProps = {
  state: StepState;
  title: string;
  isLast?: boolean;
  children: React.ReactNode;
};

const markerClass: Record<StepState, string> = {
  done: "bg-green-700 dark:bg-green-400",
  waiting: "border-2 border-amber-700 bg-white dark:border-amber-400 dark:bg-gray-900",
};

const titleClass: Record<StepState, string> = {
  done: "text-green-700 dark:text-green-400",
  waiting: "text-amber-700 dark:text-amber-400",
};

function Step({ state, title, isLast = false, children }: StepProps) {
  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      {!isLast && (
        <span aria-hidden className="absolute -bottom-1.5 left-[5px] top-4 w-px bg-gray-300 dark:bg-gray-700" />
      )}
      <span aria-hidden className={`mt-1.5 size-[11px] shrink-0 rounded-full ${markerClass[state]}`} />
      <div className="min-w-0 flex-1 space-y-1">
        <p className={`text-sm font-semibold ${titleClass[state]}`}>{title}</p>
        {children}
      </div>
    </li>
  );
}

type Props = {
  pendingAddress: string;
  activeAddress: string;
  wasJustSent: boolean;
};

export function PendingEmailChange({ pendingAddress, activeAddress, wasJustSent }: Props) {
  return (
    <div
      role={wasJustSent ? "status" : undefined}
      className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/60"
    >
      <ol>
        <Step state="done" title={wasJustSent ? "Confirmation link sent" : "Change requested"}>
          <RecordValue>{pendingAddress}</RecordValue>
        </Step>
        <Step state="waiting" title="Awaiting confirmation" isLast>
          <p className="text-pretty text-sm text-gray-600 dark:text-gray-300">
            Open the link sent to that address. It is valid{" "}
            <strong className="font-semibold text-gray-900 dark:text-gray-100">24 hours</strong> and works{" "}
            <strong className="font-semibold text-gray-900 dark:text-gray-100">once</strong>.
          </p>
        </Step>
      </ol>

      <p className="mt-1 border-t border-gray-200 pt-3 text-pretty text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
        You keep signing in with <span className="font-mono text-gray-900 dark:text-gray-100">{activeAddress}</span>{" "}
        until it is opened. Asking again within{" "}
        <strong className="font-semibold text-gray-900 dark:text-gray-100">five minutes</strong> sends no new link and
        leaves this address pending.
      </p>
    </div>
  );
}
