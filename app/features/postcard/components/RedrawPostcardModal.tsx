import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React, { useState } from "react";
import { useToast } from "~/app-state/useToast";
import type { PlacedPostcard } from "~/features/postcard/model";
import { useApi } from "~/shared/api/useApi";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  postcard: PlacedPostcard;
  close: () => void;
  onReplaced: () => void;
};

function holders(count: number): string {
  if (count === 0) {
    return "No pilot holds this postcard yet.";
  }

  return `${count} ${count === 1 ? "pilot holds" : "pilots hold"} this postcard.`;
}

export function RedrawPostcardModal({ postcard, close, onReplaced }: Props) {
  const { postcardService } = useApi();
  const { error, success, warning } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const replace = async () => {
    setSubmitting(true);

    try {
      const outcome = await postcardService.redraw(postcard.id);

      if (outcome === "already-drawing") {
        warning(`The art for ${postcard.city.name} is already being drawn.`);
      } else {
        success(`${postcard.city.name} is being drawn again.`);
      }

      onReplaced();
      close();
    } catch {
      error(`Could not replace the art for ${postcard.city.name}.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="md" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>
        <ModalTitle context={postcard.city.name} action="Replace art" />
      </ModalHeader>
      <ModalBody>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {holders(postcard.heldBy)}{" "}
          {postcard.heldBy > 0 &&
            "Replacing the art replaces what they already have, and they will not be shown a reveal again."}
        </p>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          The city, its country and its continent are drawn as the system already knows them. Nothing else is asked for.
        </p>
      </ModalBody>
      <ModalActions
        cancel={{ label: "Back", onClick: close }}
        confirm={{ label: "Replace art", onClick: replace }}
        pending={submitting}
        pendingLabel="Requesting…"
      />
    </Modal>
  );
}
