import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { CredentialField } from "~/features/auth/components/CredentialField";
import { ThirdPartySignIn } from "~/features/auth/components/ThirdPartySignIn";
import { describeGoogleSignInFailure } from "~/features/auth/lib/describeGoogleFailure";
import { readDiscordHandoff } from "~/features/auth/lib/discordHandoff";
import { failedSignInMessage, unreachableServiceMessage } from "~/features/auth/lib/serviceFailureMessages";
import { landingPathForRole } from "~/features/user/lib/landingPath";
import type { User } from "~/features/user/model";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { canAnimateAppEntry, markAppEntryOrigin } from "~/shared/lib/appEntryTransition";
import { Logo } from "~/shared/ui/Layout/Logo";

const missingCredentialsMessage = "Enter your email and password.";
const rejectedCredentialsMessage = "Email or password is incorrect. Check both and try again.";

function describeFailure(reason: unknown): string {
  const statusCode = (reason as { statusCode?: number } | null)?.statusCode;

  if (statusCode === 400 || statusCode === 401 || statusCode === 403) {
    return rejectedCredentialsMessage;
  }

  return statusCode === undefined ? unreachableServiceMessage : failedSignInMessage;
}

export default function SignInRoute() {
  usePageTitle("Sign in");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const enteringRef = useRef<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      emailRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    const failure = readDiscordHandoff(location.state)?.failure;

    if (failure === undefined) {
      return;
    }

    setError(failure);
    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.state, navigate]);

  function enterApp(signedInUser: User) {
    enteringRef.current = true;
    const destination = landingPathForRole(signedInUser.role);

    if (submitRef.current && canAnimateAppEntry()) {
      markAppEntryOrigin(submitRef.current);
      navigate(destination, { replace: true, viewTransition: true });
      return;
    }

    navigate(destination, { replace: true });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    if (!email || !password) {
      setError(missingCredentialsMessage);
      return;
    }

    setSubmitting(true);
    setError(null);

    signIn(email, password)
      .then((signedInUser) => enterApp(signedInUser))
      .catch((reason) => setError(describeFailure(reason)))
      .finally(() => setSubmitting(false));
  }

  function handleGoogleCredential(idToken: string) {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);

    signInWithGoogle(idToken)
      .then((signedInUser) => enterApp(signedInUser))
      .catch((reason) => setError(describeGoogleSignInFailure(reason)))
      .finally(() => setSubmitting(false));
  }

  if (isLoading) {
    return null;
  }

  if (user && !enteringRef.current) {
    return <Navigate to={landingPathForRole(user.role)} replace />;
  }

  return (
    <section className="flex w-full max-w-2xl flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-3 md:flex-row dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-indigo-700 px-8 py-6 md:w-1/2 md:py-0">
        <Logo tone="inverse" layout="panel" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center gap-5 p-3 sm:p-5 md:w-1/2 md:p-7"
        aria-busy={submitting}
        noValidate
      >
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sign in</h1>

        <CredentialField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          readOnly={submitting}
          inputRef={emailRef}
          onChange={setEmail}
        />
        <CredentialField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          readOnly={submitting}
          onChange={setPassword}
        />

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-pretty text-sm text-red-700 dark:border-red-900 dark:bg-red-900/40 dark:text-red-300"
          >
            <FaCircleExclamation aria-hidden className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        <Button
          ref={submitRef}
          type="submit"
          color="indigo"
          aria-disabled={submitting}
          className="mt-1 min-h-11 w-full font-bold"
        >
          {submitting ? (
            <>
              <Spinner
                size="sm"
                className="me-2 fill-white text-indigo-300 motion-reduce:animate-none dark:text-indigo-300"
              />
              Signing in
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <ThirdPartySignIn blocked={submitting} onGoogleCredential={handleGoogleCredential} />
      </form>
    </section>
  );
}
