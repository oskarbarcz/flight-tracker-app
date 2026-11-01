import { Button, Spinner } from "flowbite-react";
import React from "react";
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo } from "react-icons/fa6";
import { DeviceApproval } from "~/features/auth/components/DeviceApproval";
import { DeviceCodeForm } from "~/features/auth/components/DeviceCodeForm";
import type { DeviceActivationState, DeviceDecision } from "~/features/auth/hooks/useDeviceActivation";
import { describeAuthClient } from "~/features/auth/lib/describeAuthClient";
import { Logo } from "~/shared/ui/Layout/Logo";

type Props = {
  state: DeviceActivationState;
  account: string;
  onSubmitCode: (userCode: string) => void;
  onDecide: (decision: DeviceDecision) => void;
  onRetry: () => void;
  onEnterAnotherCode: () => void;
};

function EnterAnotherCodeButton({ onClick }: { onClick: () => void }) {
  return (
    <Button color="alternative" className="min-h-11 font-bold" onClick={onClick}>
      Enter another code
    </Button>
  );
}

function ActivationContent({ state, account, onSubmitCode, onDecide, onRetry, onEnterAnotherCode }: Props) {
  switch (state.status) {
    case "entering":
      return <DeviceCodeForm onSubmit={onSubmitCode} />;

    case "checking":
      return (
        <p className="flex items-center gap-3 text-pretty text-sm text-gray-600 dark:text-gray-400" aria-busy>
          <Spinner size="sm" className="shrink-0 motion-reduce:animate-none" />
          <span role="status">Checking the code…</span>
        </p>
      );

    case "unavailable":
      return (
        <>
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-pretty text-sm text-red-700 dark:border-red-900 dark:bg-red-900/40 dark:text-red-300"
          >
            <FaCircleExclamation aria-hidden className="mt-0.5 shrink-0" />
            <span>{state.message}</span>
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button color="indigo" className="min-h-11 font-bold" onClick={onRetry}>
              Try again
            </Button>
            <EnterAnotherCodeButton onClick={onEnterAnotherCode} />
          </div>
        </>
      );

    case "gone":
      return (
        <>
          <p className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-pretty text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <FaCircleInfo aria-hidden className="mt-0.5 shrink-0" />
            <span>
              No sign-in is waiting for <span className="font-mono font-semibold">{state.userCode}</span>. The code may
              have expired or already been used. Start again in the Transponder.
            </span>
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <EnterAnotherCodeButton onClick={onEnterAnotherCode} />
          </div>
        </>
      );

    case "awaiting":
      return (
        <DeviceApproval
          request={state.request}
          account={account}
          deciding={state.deciding}
          failure={state.failure}
          onDecide={onDecide}
        />
      );

    case "approved":
      return (
        <p role="status" className="flex items-start gap-2 text-pretty text-sm text-green-700 dark:text-green-400">
          <FaCircleCheck aria-hidden className="mt-0.5 shrink-0" />
          <span>Sign-in approved. Go back to the {describeAuthClient(state.request)} to continue.</span>
        </p>
      );

    case "declined":
      return (
        <p
          role="status"
          className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-pretty text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          <FaCircleInfo aria-hidden className="mt-0.5 shrink-0" />
          <span>Sign-in declined. The Transponder stays signed out.</span>
        </p>
      );
  }
}

export function DeviceActivationCard(props: Props) {
  return (
    <section className="flex w-full max-w-md flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-900">
      <Logo layout="panel" />

      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Transponder sign-in</h1>

      <ActivationContent {...props} />
    </section>
  );
}
