import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React from "react";
import { PostcardArt } from "~/features/postcard/components/PostcardArt";
import { PostcardStatusBadge } from "~/features/postcard/components/PostcardStatusBadge";
import { elapsedSince } from "~/features/postcard/lib/elapsed";
import { type PlacedPostcard, PostcardStatus } from "~/features/postcard/model";
import { CountryFlag } from "~/shared/ui/Display/CountryFlag";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  postcard: PlacedPostcard;
  close: () => void;
  onReplace: (postcard: PlacedPostcard) => void;
};

export function PostcardArtModal({ postcard, close, onReplace }: Props) {
  const elapsed = elapsedSince(postcard.statusChangedAt);

  return (
    <Modal size="2xl" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>
        <ModalTitle context={postcard.country.name} action={postcard.city.name} />
      </ModalHeader>
      <ModalBody>
        <div className="mx-auto max-h-[60vh] w-fit overflow-hidden rounded-xl">
          <PostcardArt postcard={postcard} className="max-h-[60vh] w-auto" />
        </div>

        <dl className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <dt className="sr-only">State of the art</dt>
            <dd>
              <PostcardStatusBadge status={postcard.status} />
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="text-gray-500 dark:text-gray-400">Held by</dt>
            <dd className="font-mono tabular-nums text-gray-900 dark:text-white">{postcard.heldBy}</dd>
          </div>
          {postcard.width !== null && postcard.height !== null && (
            <div className="flex items-center gap-2">
              <dt className="text-gray-500 dark:text-gray-400">Drawn at</dt>
              <dd className="font-mono tabular-nums text-gray-900 dark:text-white">
                {postcard.width}×{postcard.height}
              </dd>
            </div>
          )}
          {elapsed !== null && (
            <div className="flex items-center gap-2">
              <dt className="text-gray-500 dark:text-gray-400">
                {postcard.status === PostcardStatus.Pending ? "Drawing for" : "Changed"}
              </dt>
              <dd className="font-mono tabular-nums text-gray-900 dark:text-white">{elapsed}</dd>
            </div>
          )}
          <div className="flex items-center gap-2">
            <dt className="sr-only">Country</dt>
            <dd className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <CountryFlag code={postcard.country.code} name={postcard.country.name} />
              {postcard.country.name}
            </dd>
          </div>
        </dl>

        {postcard.failureReason !== null && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-200">
            {postcard.failureReason}
          </p>
        )}
      </ModalBody>
      <ModalActions
        cancel={{ label: "Close", onClick: close }}
        confirm={{
          label: "Replace art",
          onClick: () => onReplace(postcard),
          disabled: postcard.status === PostcardStatus.Pending,
        }}
      />
    </Modal>
  );
}
