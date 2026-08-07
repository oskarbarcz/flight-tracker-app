import { useState } from "react";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { useGoogleIdentity } from "~/features/auth/hooks/useGoogleIdentity";
import { describeGoogleLinkFailure } from "~/features/auth/lib/describeGoogleFailure";
import { useApi } from "~/shared/api/useApi";
import { RecordNote } from "~/shared/ui/Record/RecordNote";
import { RecordRow } from "~/shared/ui/Record/RecordRow";

type ConnectionState =
  | { status: "idle" | "connecting" | "connected" }
  | {
      status: "error";
      message: string;
    };

const explanation = "Connect a Google account to sign in with Google instead of your email and password.";
const connectedMessage = "Google account connected. You can now sign in with Google from the sign-in screen.";

export function GoogleAccountSection() {
  const { userService } = useApi();
  const [state, setState] = useState<ConnectionState>({ status: "idle" });

  function connect(idToken: string) {
    if (state.status === "connecting") {
      return;
    }

    setState({ status: "connecting" });

    userService
      .linkGoogleAccount(idToken)
      .then(() => setState({ status: "connected" }))
      .catch((reason) => setState({ status: "error", message: describeGoogleLinkFailure(reason) }));
  }

  const { containerRef, status } = useGoogleIdentity({ text: "continue_with", onCredential: connect });

  if (status === "unconfigured" || status === "unavailable") {
    return null;
  }

  if (state.status === "connected") {
    return (
      <RecordRow label="Google sign-in">
        <p role="status" className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
          <FaCircleCheck aria-hidden className="mt-0.5 shrink-0" />
          <span>{connectedMessage}</span>
        </p>
      </RecordRow>
    );
  }

  return (
    <RecordRow
      label="Google sign-in"
      className={status === "ready" ? undefined : "opacity-0"}
      action={
        <div
          ref={containerRef}
          aria-busy={state.status === "connecting"}
          className={`flex min-h-10 justify-center sm:w-56 ${
            state.status === "connecting" ? "pointer-events-none opacity-60" : ""
          }`}
        />
      }
    >
      <RecordNote>{explanation}</RecordNote>

      {state.status === "error" && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-pretty text-sm text-red-700 dark:border-red-900 dark:bg-red-900/40 dark:text-red-300"
        >
          <FaCircleExclamation aria-hidden className="mt-0.5 shrink-0" />
          <span>{state.message}</span>
        </p>
      )}
    </RecordRow>
  );
}
