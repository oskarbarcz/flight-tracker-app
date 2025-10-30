import { FormattedLocalTime } from "~/components/Intrinsic/Date/FormattedLocalTime";

type Props = {
  lastRefreshedAt: Date;
};

export default function BottomBar({ lastRefreshedAt }: Props) {
  return (
    <div className="flex items-center justify-end mt-2 py-1 px-3 w-full">
      <span className="bg-gray-200/50 dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-500 py-2 px-4 rounded-lg">
        {"Last update: "}
        <FormattedLocalTime date={lastRefreshedAt} seconds={true} />
      </span>
    </div>
  );
}
