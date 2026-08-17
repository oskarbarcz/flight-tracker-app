import { Modal, ModalBody, ModalHeader, ToggleSwitch } from "flowbite-react";
import { useState } from "react";
import { DiscordFeatureRow } from "~/features/auth/components/DiscordFeatureRow";
import { DiscordMessagesDrawer } from "~/features/auth/components/DiscordMessagesDrawer";
import type { DiscordMessages } from "~/features/auth/hooks/useDiscordMessages";
import { joinServerFeature } from "~/features/auth/lib/discordFeatures";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  messages: DiscordMessages;
  close: () => void;
  onContinue: (joinServer: boolean) => void;
};

const intro = "Choose what MyPreflight may do with your Discord account before you connect it.";
const consentNote = "Discord will ask you to confirm.";

export function DiscordSettingsModal({ messages, close, onContinue }: Props) {
  const [joinServer, setJoinServer] = useState<boolean>(false);

  return (
    <Modal size="lg" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>
        <ModalTitle context="Account" action="Discord settings" />
      </ModalHeader>
      <ModalBody>
        <div className="space-y-3">
          <p className="text-pretty text-sm text-gray-600 dark:text-gray-400">{intro}</p>

          <DiscordMessagesDrawer messages={messages} />

          <DiscordFeatureRow
            label={joinServerFeature.label}
            description={joinServerFeature.description}
            control={
              <ToggleSwitch
                checked={joinServer}
                color="indigo"
                sizing="sm"
                aria-label={joinServerFeature.label}
                onChange={setJoinServer}
              />
            }
          />
        </div>
      </ModalBody>
      <ModalActions
        cancel={{ onClick: close }}
        confirm={{ label: "Continue to Discord", onClick: () => onContinue(joinServer) }}
        note={consentNote}
      />
    </Modal>
  );
}
