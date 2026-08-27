import React from "react";
import { PostcardImage } from "~/features/postcard/components/PostcardImage";
import type { CollectedPostcard } from "~/features/postcard/model";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { CountryFlag } from "~/shared/ui/Display/CountryFlag";

type Props = {
  postcard: CollectedPostcard;
  onOpen: (postcard: CollectedPostcard) => void;
};

export function PostcardTile({ postcard, onOpen }: Props) {
  return (
    <figure className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => onOpen(postcard)}
        aria-label={`See the postcard from ${postcard.city.name} larger`}
        className="block cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400"
      >
        <PostcardImage
          imageUrl={postcard.imageUrl}
          cityName={postcard.city.name}
          width={postcard.width}
          height={postcard.height}
        />
      </button>

      <figcaption className="flex flex-col gap-1 px-3 py-2.5">
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white" title={postcard.city.name}>
          {postcard.city.name}
        </p>
        <span className="flex min-w-0 items-center gap-1.5">
          <CountryFlag code={postcard.country.code} name={postcard.country.name} />
          <span className="truncate text-xs text-gray-500 dark:text-gray-400" title={postcard.country.name}>
            {postcard.country.name}
          </span>
        </span>

        <span className="font-mono text-xs tabular-nums text-gray-400 dark:text-gray-500">
          <FormattedIcaoDate date={new Date(postcard.awardedAt)} />
        </span>
      </figcaption>
    </figure>
  );
}
