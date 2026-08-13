import React from "react";
import type { IconType } from "react-icons";
import { LuFileCheck, LuTriangleAlert } from "react-icons/lu";

type Props = {
  icaoCode: string;
};

export function NotamListEmptyState({ icaoCode }: Props) {
  return (
    <NotamNotice icon={LuFileCheck} title={`No NOTAMs in force at ${icaoCode}.`}>
      Nothing is currently notified as closed, unserviceable or restricted.
    </NotamNotice>
  );
}

export function NotamListUnavailableState({ icaoCode }: Props) {
  return (
    <NotamNotice icon={LuTriangleAlert} title={`NOTAMs for ${icaoCode} could not be retrieved.`}>
      Treat this as unknown, not as clear. Reload the page to try again.
    </NotamNotice>
  );
}

function NotamNotice({ icon: Icon, title, children }: { icon: IconType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-gray-50 px-6 py-10 text-center dark:bg-gray-900">
      <Icon aria-hidden className="mx-auto size-5 text-gray-400 dark:text-gray-500" />
      <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{children}</p>
    </div>
  );
}
