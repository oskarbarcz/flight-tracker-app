import { Spinner } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { describeDiscordLinkFailure, describeDiscordSignInFailure } from "~/features/auth/lib/describeDiscordFailure";
import { discordCallbackUrl } from "~/features/auth/lib/discordAuthorization";
import { type DiscordFlowState, takeDiscordFlow } from "~/features/auth/lib/discordFlowState";
import { withDiscordHandoff } from "~/features/auth/lib/discordHandoff";
import { landingPathForRole } from "~/features/user/lib/landingPath";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

const accountPath = "/me/account";
const signInPath = "/sign-in";

const unverifiedReturnMessage =
  "That Discord response couldn't be verified as a reply to a request from this browser, so it was ignored. Start again from MyPreflight.";
const incompleteReturnMessage = "Discord didn't send back what was needed. Start again from MyPreflight.";
const interruptedMessage = "Discord couldn't complete the request. Try again.";

type Completion = { path: string; state?: { discord: unknown } };

let pendingCompletion: { code: string; result: Promise<Completion> } | null = null;

function completeOnce(code: string, run: () => Promise<Completion>): Promise<Completion> {
  if (pendingCompletion !== null && pendingCompletion.code === code) {
    return pendingCompletion.result;
  }

  const result = run();
  pendingCompletion = { code, result };

  return result;
}

export default function DiscordCallbackRoute() {
  usePageTitle("Discord");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInWithDiscord, user, isLoading } = useAuth();
  const { userService } = useApi();
  const startedRef = useRef<boolean>(false);
  const [flow] = useState<DiscordFlowState | null>(() => takeDiscordFlow());

  useEffect(() => {
    if (startedRef.current || isLoading) {
      return;
    }

    startedRef.current = true;

    const code = searchParams.get("code");
    const returnedState = searchParams.get("state");
    const error = searchParams.get("error");

    const idleDestination = user === null ? signInPath : accountPath;

    function leave(completion: Completion): void {
      navigate(completion.path, { replace: true, state: completion.state });
    }

    function fail(message: string, forLink: boolean): void {
      leave({ path: forLink ? accountPath : signInPath, state: withDiscordHandoff({ failure: message }) });
    }

    if (flow === null) {
      leave({ path: idleDestination });
      return;
    }

    const forLink = flow.intent === "link";
    const destination = forLink ? accountPath : signInPath;

    if (error !== null) {
      if (error === "access_denied") {
        leave({ path: destination });
        return;
      }

      fail(interruptedMessage, forLink);
      return;
    }

    if (code === null || returnedState === null) {
      fail(incompleteReturnMessage, forLink);
      return;
    }

    if (returnedState !== flow.state) {
      fail(unverifiedReturnMessage, forLink);
      return;
    }

    const authorization = { code, redirectUri: discordCallbackUrl(), codeVerifier: flow.codeVerifier };

    completeOnce(code, () => {
      if (forLink) {
        return userService
          .linkDiscordAccount({ ...authorization, joinServer: flow.joinServer })
          .then((link) => ({ path: accountPath, state: withDiscordHandoff({ link }) }))
          .catch((reason) => ({
            path: accountPath,
            state: withDiscordHandoff({ failure: describeDiscordLinkFailure(reason) }),
          }));
      }

      return signInWithDiscord(authorization)
        .then((signedInUser) => ({ path: landingPathForRole(signedInUser.role) }))
        .catch((reason) => ({
          path: signInPath,
          state: withDiscordHandoff({ failure: describeDiscordSignInFailure(reason) }),
        }));
    }).then(leave);
  }, [flow, isLoading, navigate, searchParams, signInWithDiscord, user, userService]);

  return (
    <section
      aria-busy
      className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl border border-gray-200 bg-white px-6 py-10 dark:border-gray-800 dark:bg-gray-900"
    >
      <Spinner size="lg" className="fill-indigo-600 text-indigo-200 motion-reduce:animate-none dark:text-indigo-900" />
      <p role="status" className="text-pretty text-center text-sm text-gray-600 dark:text-gray-400">
        {flow?.intent === "link" ? "Connecting your Discord account…" : "Completing Discord sign-in…"}
      </p>
    </section>
  );
}
