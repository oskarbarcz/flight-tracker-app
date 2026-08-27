import React from "react";
import type { CollectedPostcard } from "~/features/postcard/model";

type Props = {
  queue: CollectedPostcard[];
  shown: number;
};

export function CeremonyProgress({ queue, shown }: Props) {
  if (queue.length < 2) {
    return null;
  }

  return (
    <span className="flex items-center gap-1.5" aria-hidden={true}>
      {queue.map((postcard, index) => (
        <span
          key={postcard.id}
          className={`size-1.5 rounded-full ${
            index <= shown ? "bg-indigo-500 dark:bg-indigo-400" : "bg-gray-300 dark:bg-gray-600"
          }`}
        />
      ))}
      <span className="ms-1.5 font-mono tabular-nums">
        {shown + 1} of {queue.length}
      </span>
    </span>
  );
}
