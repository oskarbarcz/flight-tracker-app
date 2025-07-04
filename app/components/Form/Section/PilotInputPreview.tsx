import { Button } from "flowbite-react";
import React from "react";
import { GetUserResponse } from "~/models";
import { FaTrash } from "react-icons/fa";

type PilotInputPreviewProps = {
  user: GetUserResponse;
  onClose: () => void;
};

export default function PilotInputPreview({
  onClose,
  user,
}: PilotInputPreviewProps) {
  return (
    <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
      <div>
        <span className="block text-lg dark:text-white">{user.name}</span>
        <span className="mt-1 block text-xs dark:text-gray-300">
          Email: {user.email}
        </span>
        <span className="text-xs dark:text-gray-300">
          License ID: {user.pilotLicenseId}
        </span>
      </div>
      <div>
        <Button
          onClick={() => onClose()}
          color="gray"
          size="lg"
          className="cursor-pointer"
        >
          <FaTrash />
        </Button>
      </div>
    </div>
  );
}
