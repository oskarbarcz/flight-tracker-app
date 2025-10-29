import { FormattedLocalTime } from "~/components/Intrinsic/Date/FormattedLocalTime";
import { useEffect, useState } from "react";

export default function BottomBar() {
  const [refreshedAt, setRefreshedAt] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setRefreshedAt(new Date()), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-end mt-2 py-1 px-3 w-full">
      <span className="bg-gray-100 dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-500 py-2 px-4 rounded-lg">
        {"Last update: "}
        <FormattedLocalTime date={refreshedAt} seconds={true} />
      </span>
    </div>
  );
}
