import React from "react";
import { PostcardArt } from "~/features/postcard/components/PostcardArt";
import { PostcardStatusBadge } from "~/features/postcard/components/PostcardStatusBadge";
import { elapsedSince } from "~/features/postcard/lib/elapsed";
import { type PlacedPostcard, PostcardStatus } from "~/features/postcard/model";

type Props = {
  postcard: PlacedPostcard;
  onZoom: (postcard: PlacedPostcard) => void;
  onReplace: (postcard: PlacedPostcard) => void;
};

export function PostcardCard({ postcard, onZoom, onReplace }: Props) {
  const elapsed = elapsedSince(postcard.statusChangedAt);
  const isDrawing = postcard.status === PostcardStatus.Pending;

  return (
    <figure className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => onZoom(postcard)}
        aria-label={`See the postcard for ${postcard.city.name} larger`}
        className="block cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400"
      >
        <PostcardArt postcard={postcard} />
      </button>

      <figcaption className="flex flex-1 flex-col gap-1.5 px-3 py-2.5">
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white" title={postcard.city.name}>
          {postcard.city.name}
        </p>

        <div className="flex items-center justify-between gap-2">
          <PostcardStatusBadge status={postcard.status} />
          <span className="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
            {postcard.heldBy} held
          </span>
        </div>

        {isDrawing && elapsed !== null && (
          <p className="text-xs text-gray-500 dark:text-gray-400">Drawing for {elapsed}</p>
        )}

        {postcard.status === PostcardStatus.Failed && postcard.failureReason !== null && (
          <p className="text-xs text-red-700 dark:text-red-300" title={postcard.failureReason}>
            {postcard.failureReason}
          </p>
        )}

        <button
          type="button"
          disabled={isDrawing}
          onClick={() => onReplace(postcard)}
          className="mt-auto cursor-pointer rounded-lg border border-gray-200 px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Replace art
        </button>
      </figcaption>
    </figure>
  );
}
