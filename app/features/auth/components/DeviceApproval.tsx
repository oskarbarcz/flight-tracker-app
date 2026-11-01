import { Button, Spinner } from "flowbite-react";
import React from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import type { DeviceDecision } from "~/features/auth/hooks/useDeviceActivation";
import { describeAuthClient } from "~/features/auth/lib/describeAuthClient";
import type { DeviceSignIn } from "~/features/auth/model";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  request: DeviceSignIn;
  account: string;
  deciding: DeviceDecision | null;
  failure: string | null;
  onDecide: (decision: DeviceDecision) => void;
};

const blockedClass = "pointer-events-none opacity-60";

type DecisionLabelProps = {
  pending: boolean;
  label: string;
  pendingLabel: string;
  spinnerClassName: string;
};

function DecisionLabel({ pending, label, pendingLabel, spinnerClassName }: DecisionLabelProps) {
  if (!pending) {
    return <>{label}</>;
  }

  return (
    <>
      <Spinner size="sm" className={`me-2 motion-reduce:animate-none ${spinnerClassName}`} />
      {pendingLabel}
    </>
  );
}

export function DeviceApproval({ request, account, deciding, failure, onDecide }: Props) {
  const requester = `${request.deviceName === null ? "A" : "The"} ${describeAuthClient(request)}`;
  const blocked = deciding !== null;

  function decide(decision: DeviceDecision) {
    if (!blocked) {
      onDecide(decision);
    }
  }

  return (
    <div className="flex flex-col gap-5" aria-busy={blocked}>
      <p className="text-pretty text-sm text-gray-700 dark:text-gray-300">
        {requester} is asking to sign in as{" "}
        <span className="break-words font-semibold text-gray-900 dark:text-white">{account}</span>.
      </p>

      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-center dark:border-gray-800 dark:bg-gray-800/60">
        <FieldLabel className="tracking-[0.08em]">Code</FieldLabel>
        <p className="mt-2 font-mono text-3xl font-bold leading-none tracking-[0.12em] tabular-nums text-gray-900 dark:text-white">
          {request.userCode}
        </p>
      </div>

      <p className="text-pretty text-sm text-gray-600 dark:text-gray-400">
        Check that this code matches the one shown in the Transponder. If you didn’t start this sign-in, decline it.
      </p>

      {failure !== null && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-pretty text-sm text-red-700 dark:border-red-900 dark:bg-red-900/40 dark:text-red-300"
        >
          <FaCircleExclamation aria-hidden className="mt-0.5 shrink-0" />
          <span>{failure}</span>
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          color="indigo"
          aria-disabled={blocked}
          className={`min-h-11 font-bold sm:flex-1 ${blocked ? blockedClass : ""}`}
          onClick={() => decide("approve")}
        >
          <DecisionLabel
            pending={deciding === "approve"}
            label="Approve"
            pendingLabel="Approving…"
            spinnerClassName="fill-white text-indigo-300 dark:text-indigo-300"
          />
        </Button>
        <Button
          color="alternative"
          aria-disabled={blocked}
          className={`min-h-11 font-bold sm:flex-1 ${blocked ? blockedClass : ""}`}
          onClick={() => decide("decline")}
        >
          <DecisionLabel
            pending={deciding === "decline"}
            label="Decline"
            pendingLabel="Declining…"
            spinnerClassName="fill-indigo-600 text-gray-200 dark:text-gray-600"
          />
        </Button>
      </div>
    </div>
  );
}
