import { FormattedLocalTime } from "~/components/Intrinsic/Date/FormattedLocalTime";
import { useAppConfig } from "~/state/hooks/useAppConfig";
import { useAdsbData } from "~/state/contexts/content/adsb.context";
import VerticalSeparator from "~/components/Map/FullScreen/Element/VerticalSeparator";

export default function BottomBar() {
  const { appVersion } = useAppConfig();
  const { lastRequestedAt, flightPath } = useAdsbData();

  const lastRefreshedAt = lastRequestedAt ?? new Date();

  return (
    <div className="flex items-center justify-between mt-2 py-1 px-3 w-full">
      <span className="text-gray-500 font-mono text-xs">v{appVersion}</span>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-3">
          <div className="bg-gray-200/50 dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-500 py-2 px-4 rounded-lg">
            <span className="font-bold">{flightPath.length}</span>
            {" segments"}
          </div>
          <VerticalSeparator />
        </div>
        <div className="bg-gray-200/50 dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-500 py-2 px-4 rounded-lg">
          {"Last update: "}
          <FormattedLocalTime date={lastRefreshedAt} seconds={true} />
        </div>
      </div>
    </div>
  );
}
