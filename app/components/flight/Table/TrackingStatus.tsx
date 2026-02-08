import { Tooltip } from "flowbite-react";
import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Tracking } from "~/models";

type Props = {
  tracking: Tracking;
};

export default function TrackingStatus({ tracking }: Props) {
  if (tracking === Tracking.Disabled)
    return (
      <Tooltip content="Flight is visible only to you and cannot be tracked by third parties.">
        <div className="font-bold flex items-center gap-1 text-gray-500">
          <FaInfoCircle className="inline" />
          Disabled
        </div>
      </Tooltip>
    );

  if (tracking === Tracking.Private)
    return (
      <Tooltip content="Flight is visible only to you and people you share tracking link with.">
        <div className="font-bold flex items-center gap-1 text-primary-700">
          <FaInfoCircle className="inline" />
          Private
        </div>
      </Tooltip>
    );

  return (
    <Tooltip content="Flight is visible for anyone on the internet.">
      <div className="font-bold flex items-center gap-1 text-primary-500">
        <FaInfoCircle className="inline" />
        Public
      </div>
    </Tooltip>
  );
}
