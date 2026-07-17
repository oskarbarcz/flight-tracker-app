import { Link } from "react-router";
import logo from "~/assets/logo.svg";
import { DiscordButton } from "~/features/flight/components/Map/FullScreen/Element/DiscordButton";
import { GitHubButton } from "~/features/flight/components/Map/FullScreen/Element/GitHubButton";
import { ThemeSwitchButton } from "~/features/flight/components/Map/FullScreen/Element/ThemeSwitchButton";
import { VerticalSeparator } from "~/features/flight/components/Map/FullScreen/Element/VerticalSeparator";
import { dateToLocalTime } from "~/shared/ui/Date/FormattedLocalTime";

type Props = {
  lastUpdatedAt?: Date | null;
};

export function MapHeader({ lastUpdatedAt }: Props) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 bg-gradient-to-b from-gray-100/95 via-gray-100/55 to-transparent px-4 pb-12 pt-3 dark:from-gray-950/95 dark:via-gray-950/50">
      <div className="flex items-center justify-between gap-3">
        <Link to="/" className="pointer-events-auto flex items-center gap-2">
          <img src={logo} className="h-6" alt="Flight Tracker app logo" />
          <span className="text-xl font-bold text-indigo-500">Flight Tracker</span>
        </Link>

        <div className="pointer-events-auto flex items-center gap-3">
          {lastUpdatedAt && (
            <span className="hidden items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-900/70 dark:text-gray-300 sm:inline-flex">
              <span className="size-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
              Updated <span className="font-mono tabular-nums">{dateToLocalTime(lastUpdatedAt, false)}</span>
            </span>
          )}
          <ThemeSwitchButton />
          <VerticalSeparator />
          <DiscordButton />
          <GitHubButton />
        </div>
      </div>
    </div>
  );
}
