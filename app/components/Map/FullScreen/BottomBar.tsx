import { FormattedLocalTime } from "~/components/Intrinsic/Date/FormattedLocalTime";
import { useAppConfig } from "~/state/hooks/useAppConfig";

type Props = {
  lastRefreshedAt: Date;
};

export default function BottomBar({ lastRefreshedAt }: Props) {
  const { appVersion } = useAppConfig();

  return (
    <div className="flex items-center justify-between mt-2 py-1 px-3 w-full">
      <span className="text-gray-500 font-mono text-xs">v{appVersion}</span>
      <div className="bg-gray-200/50 dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-500 py-2 px-4 rounded-lg">
        {"Last update: "}
        <FormattedLocalTime date={lastRefreshedAt} seconds={true} />
      </div>
    </div>
  );
}
