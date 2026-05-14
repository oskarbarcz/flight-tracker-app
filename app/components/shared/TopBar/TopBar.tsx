import React, { type ReactNode } from "react";
import { TopBarLogo } from "./TopBarLogo";
import { TopBarUserTile } from "./TopBarUserTile";

type Props = {
  mobileMenuTrigger?: ReactNode;
};

export function TopBar({ mobileMenuTrigger }: Props) {
  return (
    <header className="bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 md:px-5 py-3 gap-2 sm:gap-4">
        <div className="flex items-center gap-3 justify-between sm:justify-start">
          {mobileMenuTrigger && <div className="md:hidden">{mobileMenuTrigger}</div>}
          <TopBarLogo />
          {mobileMenuTrigger && <div className="sm:hidden w-10" aria-hidden />}
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <TopBarUserTile />
        </div>
      </div>
    </header>
  );
}
