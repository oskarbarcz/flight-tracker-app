import { Button, Toast } from "flowbite-react";
import { HiRefresh } from "react-icons/hi";

interface Props {
  onReload: () => void;
}

export function UpdateToast({ onReload }: Props) {
  return (
    <Toast>
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-500 dark:bg-indigo-800 dark:text-indigo-200">
        <HiRefresh className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-normal">A new version is available.</div>
      <Button color="indigo" size="xs" className="ml-3 shrink-0" onClick={onReload}>
        Reload
      </Button>
    </Toast>
  );
}
