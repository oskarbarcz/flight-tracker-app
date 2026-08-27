import React, { useState } from "react";
import { LuImageOff } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { ArtPlaceholder } from "~/features/postcard/components/ArtPlaceholder";
import { postcardArtUrl } from "~/features/postcard/lib/artUrl";

const DRAWN_RATIO = 1152 / 1536;

type Props = {
  imageUrl: string;
  cityName: string;
  width: number | null;
  height: number | null;
  className?: string;
};

export function PostcardImage({ imageUrl, cityName, width, height, className }: Props) {
  const [unreachable, setUnreachable] = useState(false);

  const ratio = width && height ? width / height : DRAWN_RATIO;

  return (
    <div
      className={twMerge("w-full overflow-hidden bg-gray-50 dark:bg-gray-800/60", className)}
      style={{ aspectRatio: ratio }}
    >
      {unreachable ? (
        <ArtPlaceholder icon={LuImageOff} label="Art unreachable" />
      ) : (
        <img
          src={postcardArtUrl(imageUrl)}
          alt={`Postcard art for ${cityName}`}
          loading="lazy"
          decoding="async"
          width={width ?? undefined}
          height={height ?? undefined}
          onError={() => setUnreachable(true)}
          className="h-full w-full object-contain"
        />
      )}
    </div>
  );
}
