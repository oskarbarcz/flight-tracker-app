import React from "react";
import { LuImageOff, LuLoaderCircle } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { ArtPlaceholder } from "~/features/postcard/components/ArtPlaceholder";
import { PostcardImage } from "~/features/postcard/components/PostcardImage";
import { type PlacedPostcard, PostcardStatus } from "~/features/postcard/model";

const DRAWN_RATIO = 1152 / 1536;

type Props = {
  postcard: PlacedPostcard;
  className?: string;
};

export function PostcardArt({ postcard, className }: Props) {
  if (postcard.status === PostcardStatus.Ready && postcard.imageUrl !== null) {
    return (
      <PostcardImage
        imageUrl={postcard.imageUrl}
        cityName={postcard.city.name}
        width={postcard.width}
        height={postcard.height}
        className={className}
      />
    );
  }

  const ratio = postcard.width && postcard.height ? postcard.width / postcard.height : DRAWN_RATIO;

  return (
    <div
      className={twMerge("w-full overflow-hidden bg-gray-50 dark:bg-gray-800/60", className)}
      style={{ aspectRatio: ratio }}
    >
      {postcard.status === PostcardStatus.Pending ? (
        <ArtPlaceholder icon={LuLoaderCircle} label="Being drawn" spin />
      ) : (
        <ArtPlaceholder icon={LuImageOff} label="No art" />
      )}
    </div>
  );
}
