import React, { useState } from "react";
import type { IconType } from "react-icons";
import { LuImageOff, LuLoaderCircle } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { postcardArtUrl } from "~/features/postcard/lib/artUrl";
import { type PlacedPostcard, PostcardStatus } from "~/features/postcard/model";

const DRAWN_RATIO = 1152 / 1536;

type Props = {
  postcard: PlacedPostcard;
  className?: string;
};

function Placeholder({ icon: Icon, label, spin = false }: { icon: IconType; label: string; spin?: boolean }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-50 text-gray-400 dark:bg-gray-800/60 dark:text-gray-500">
      <Icon className={`size-6 ${spin ? "animate-spin motion-reduce:animate-none" : ""}`} aria-hidden={true} />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

export function PostcardArt({ postcard, className }: Props) {
  const [unreachable, setUnreachable] = useState(false);

  const ratio = postcard.width && postcard.height ? postcard.width / postcard.height : DRAWN_RATIO;
  const artUrl = postcard.status === PostcardStatus.Ready ? postcard.imageUrl : null;

  return (
    <div
      className={twMerge("w-full overflow-hidden bg-gray-50 dark:bg-gray-800/60", className)}
      style={{ aspectRatio: ratio }}
    >
      {postcard.status === PostcardStatus.Pending && <Placeholder icon={LuLoaderCircle} label="Being drawn" spin />}

      {postcard.status === PostcardStatus.Failed && <Placeholder icon={LuImageOff} label="No art" />}

      {artUrl !== null &&
        (unreachable ? (
          <Placeholder icon={LuImageOff} label="Art unreachable" />
        ) : (
          <img
            src={postcardArtUrl(artUrl)}
            alt={`Postcard art for ${postcard.city.name}`}
            loading="lazy"
            decoding="async"
            width={postcard.width ?? undefined}
            height={postcard.height ?? undefined}
            onError={() => setUnreachable(true)}
            className="h-full w-full object-contain"
          />
        ))}
    </div>
  );
}
