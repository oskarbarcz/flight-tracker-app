import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React from "react";
import { PostcardPresentation } from "~/features/postcard/components/Ceremony/PostcardPresentation";
import type { CollectedPostcard } from "~/features/postcard/model";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  postcard: CollectedPostcard;
  close: () => void;
};

export function PostcardModal({ postcard, close }: Props) {
  return (
    <Modal size="2xl" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>
        <ModalTitle context={postcard.country.name} action={postcard.city.name} />
      </ModalHeader>
      <ModalBody>
        <PostcardPresentation postcard={postcard} />
      </ModalBody>
      <ModalActions cancel={{ label: "Close", onClick: close }} confirm={{ label: "Done", onClick: close }} />
    </Modal>
  );
}
