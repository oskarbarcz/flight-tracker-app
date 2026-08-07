import { Button, Spinner } from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo } from "react-icons/fa6";
import { Link, useSearchParams } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { describeEmailChangeConfirmationFailure } from "~/features/user/lib/describeEmailChangeConfirmationFailure";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { Logo } from "~/shared/ui/Layout/Logo";

type ConfirmationState =
  | { status: "submitting" }
  | { status: "confirmed" }
  | { status: "failed"; message: string; isRetryable: boolean }
  | { status: "unusable" };

const submittingMessage = "Confirming your new email address…";
const confirmedMessage =
  "Your new email address is confirmed and is now the address you sign in with. Every session has been signed out, so sign in again to continue.";
const unusableMessage =
  "This link is incomplete, so there is nothing to confirm. Open the most recent link from the message sent to your new address.";

export default function ConfirmEmailRoute() {
  usePageTitle("Confirm email address");
  const [searchParams] = useSearchParams();
  const { userService } = useApi();
  const { clearSession } = useAuth();

  const token = searchParams.get("token") ?? "";
  const [state, setState] = useState<ConfirmationState>(
    token === "" ? { status: "unusable" } : { status: "submitting" },
  );
  const hasSubmittedRef = useRef(false);

  const confirm = useCallback(() => {
    setState({ status: "submitting" });

    userService
      .confirmEmailChange(token)
      .then(() => {
        clearSession();
        setState({ status: "confirmed" });
      })
      .catch((reason) => setState({ status: "failed", ...describeEmailChangeConfirmationFailure(reason) }));
  }, [userService, clearSession, token]);

  useEffect(() => {
    if (token === "" || hasSubmittedRef.current) {
      return;
    }

    hasSubmittedRef.current = true;
    confirm();
  }, [token, confirm]);

  return (
    <section className="flex w-full max-w-md flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-900">
      <Logo layout="panel" />

      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Confirm email address</h1>

      {state.status === "submitting" && (
        <p className="flex items-center gap-3 text-pretty text-sm text-gray-600 dark:text-gray-400" aria-busy>
          <Spinner size="sm" className="shrink-0 motion-reduce:animate-none" />
          <span>{submittingMessage}</span>
        </p>
      )}

      {state.status === "confirmed" && (
        <p className="flex items-start gap-2 text-pretty text-sm text-green-700 dark:text-green-400">
          <FaCircleCheck aria-hidden className="mt-0.5 shrink-0" />
          <span>{confirmedMessage}</span>
        </p>
      )}

      {state.status === "failed" && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-pretty text-sm text-red-700 dark:border-red-900 dark:bg-red-900/40 dark:text-red-300"
        >
          <FaCircleExclamation aria-hidden className="mt-0.5 shrink-0" />
          <span>{state.message}</span>
        </p>
      )}

      {state.status === "unusable" && (
        <p className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-pretty text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <FaCircleInfo aria-hidden className="mt-0.5 shrink-0" />
          <span>{unusableMessage}</span>
        </p>
      )}

      {state.status !== "submitting" && (
        <div className="flex flex-col gap-2 sm:flex-row">
          {state.status === "failed" && state.isRetryable && (
            <Button color="indigo" className="min-h-11 font-bold" onClick={confirm}>
              Try again
            </Button>
          )}
          <Button
            as={Link}
            to="/sign-in"
            color={state.status === "confirmed" ? "indigo" : "gray"}
            outline={state.status !== "confirmed"}
            className="min-h-11 font-bold"
          >
            Sign in
          </Button>
        </div>
      )}
    </section>
  );
}
