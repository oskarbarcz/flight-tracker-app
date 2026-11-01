import { Badge, Button } from "flowbite-react";
import React, { useState } from "react";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { LuGlobe, LuRadioTower } from "react-icons/lu";
import { SignOutDeviceModal } from "~/features/auth/components/SignOutDeviceModal";
import type { AuthSessionsControl } from "~/features/auth/hooks/useAuthSessions";
import { sessionsLoadFailureMessage } from "~/features/auth/lib/authSessions";
import { describeAuthClient } from "~/features/auth/lib/describeAuthClient";
import { AuthClient, type AuthSession } from "~/features/auth/model";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";
import { RecordNote } from "~/shared/ui/Record/RecordNote";
import { RecordRow } from "~/shared/ui/Record/RecordRow";
import { LoadingData } from "~/shared/ui/Table/LoadingStates/LoadingData";

type Props = {
  devices: AuthSessionsControl;
};

type SignOutRequest = (session: AuthSession) => void;

const label = "Signed-in devices";
const note = "Sign out any device you don’t recognise.";

const clientIcons = {
  [AuthClient.Web]: LuGlobe,
  [AuthClient.Transponder]: LuRadioTower,
};

function SessionTime({ at }: { at: string }) {
  const date = new Date(at);

  return (
    <time dateTime={at} className="text-gray-900 dark:text-gray-100">
      <FormattedIcaoDate date={date} /> <FormattedIcaoTime date={date} />
    </time>
  );
}

function SessionRow({ session, onSignOut }: { session: AuthSession; onSignOut: SignOutRequest }) {
  const Icon = clientIcons[session.client];
  const name = describeAuthClient(session);

  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-500 ring-1 ring-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-700">
        <Icon aria-hidden className="size-4" />
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="min-w-0 break-words text-sm font-semibold text-gray-900 dark:text-white">{name}</span>
          {session.current && (
            <Badge color="gray" size="xs">
              This device
            </Badge>
          )}
        </p>
        <p className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-600 dark:text-gray-400">
          <span className="whitespace-nowrap">
            Signed in <SessionTime at={session.createdAt} />
          </span>
          <span className="whitespace-nowrap">
            Last active <SessionTime at={session.lastUsedAt} />
          </span>
        </p>
      </div>

      {!session.current && (
        <Button
          color="light"
          size="sm"
          className="min-h-10 shrink-0"
          aria-label={`Sign out ${name}`}
          onClick={() => onSignOut(session)}
        >
          Sign out
        </Button>
      )}
    </li>
  );
}

function SessionList({ sessions, onSignOut }: { sessions: AuthSession[] | null; onSignOut: SignOutRequest }) {
  if (sessions === null) {
    return <LoadingData />;
  }

  if (sessions.length === 0) {
    return <ContainerEmptyState>No devices are signed in.</ContainerEmptyState>;
  }

  return (
    <ul
      aria-label={label}
      className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-800/60"
    >
      {sessions.map((session) => (
        <SessionRow key={session.id} session={session} onSignOut={onSignOut} />
      ))}
    </ul>
  );
}

export function SignedInDevicesPanel({ devices }: Props) {
  const { sessions, loadFailed, signOut } = devices;
  const [confirming, setConfirming] = useState<AuthSession | null>(null);
  const [signedOut, setSignedOut] = useState<string | null>(null);

  if (loadFailed) {
    return (
      <RecordRow label={label}>
        <p
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-pretty text-sm text-red-700 dark:border-red-900 dark:bg-red-900/40 dark:text-red-300"
        >
          <FaCircleExclamation aria-hidden className="mt-0.5 shrink-0" />
          <span>{sessionsLoadFailureMessage}</span>
        </p>
      </RecordRow>
    );
  }

  function askToSignOut(session: AuthSession) {
    setSignedOut(null);
    setConfirming(session);
  }

  return (
    <RecordRow label={label} detail={<SessionList sessions={sessions} onSignOut={askToSignOut} />}>
      {signedOut === null ? (
        <RecordNote>{note}</RecordNote>
      ) : (
        <p role="status" className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
          <FaCircleCheck aria-hidden className="mt-0.5 shrink-0" />
          <span>{signedOut} signed out.</span>
        </p>
      )}

      {confirming !== null && (
        <SignOutDeviceModal
          session={confirming}
          signOut={signOut}
          close={() => setConfirming(null)}
          onSignedOut={() => {
            setSignedOut(describeAuthClient(confirming));
            setConfirming(null);
          }}
        />
      )}
    </RecordRow>
  );
}
