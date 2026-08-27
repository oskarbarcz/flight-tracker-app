import React from "react";
import { PostcardTile } from "~/features/postcard/components/Collection/PostcardTile";
import type { CollectedPostcard } from "~/features/postcard/model";

type Props = {
  postcards: CollectedPostcard[];
  onOpen: (postcard: CollectedPostcard) => void;
};

export function PostcardCollectionGrid({ postcards, onOpen }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {postcards.map((postcard) => (
        <PostcardTile key={postcard.id} postcard={postcard} onOpen={onOpen} />
      ))}
    </div>
  );
}
