import { Spinner } from "flowbite-react";

export function LoadingData() {
  return (
    <div className="py-5 flex items-center justify-center text-gray-500 text-center">
      <Spinner className="mr-2" size="sm" />
      Loading...
    </div>
  );
}
