import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { CeremonyProgress } from "~/features/postcard/components/Ceremony/CeremonyProgress";
import { Confetti } from "~/features/postcard/components/Ceremony/Confetti";
import { PostcardPresentation } from "~/features/postcard/components/Ceremony/PostcardPresentation";
import type { CollectedPostcard } from "~/features/postcard/model";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  postcards: CollectedPostcard[];
  close: () => void;
  onPresented: (id: string) => void;
};

export function PostcardCeremony({ postcards, close, onPresented }: Props) {
  const [queue] = useState(() => postcards);
  const [shown, setShown] = useState(0);

  const postcard = queue[shown];
  const isLast = shown === queue.length - 1;

  useEffect(() => {
    if (postcard !== undefined) {
      onPresented(postcard.id);
    }
  }, [postcard, onPresented]);

  if (postcard === undefined) {
    return null;
  }

  return (
    <>
      <Confetti />
      <Modal size="2xl" className="text-gray-800 dark:text-white" show onClose={close}>
        <ModalHeader>
          <ModalTitle context={postcard.country.name} action={postcard.city.name} />
        </ModalHeader>
        <ModalBody>
          <p role="status" aria-live="polite" className="sr-only">
            {postcard.city.name}, {postcard.country.name}
            {queue.length > 1 && `, ${shown + 1} of ${queue.length}`}
          </p>
          <PostcardPresentation postcard={postcard} />
        </ModalBody>
        <ModalActions
          cancel={{ label: "Close", onClick: close }}
          confirm={{
            label: isLast ? "Done" : "Next",
            onClick: isLast ? close : () => setShown((current) => current + 1),
          }}
          note={<CeremonyProgress queue={queue} shown={shown} />}
        />
      </Modal>
    </>
  );
}
