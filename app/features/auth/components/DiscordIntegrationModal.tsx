import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { DiscordAccountHeader } from "~/features/auth/components/DiscordAccountHeader";
import { DiscordMessagesDrawer } from "~/features/auth/components/DiscordMessagesDrawer";
import type { DiscordMessages } from "~/features/auth/hooks/useDiscordMessages";
import type { DiscordMembershipState } from "~/features/auth/lib/discordFeatures";
import type { DiscordIdentity } from "~/features/user";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  identity: DiscordIdentity;
  membership: DiscordMembershipState;
  messages: DiscordMessages;
  inviteUrl: string | null;
  close: () => void;
  onDisconnect: () => void;
};

export function DiscordIntegrationModal({ identity, membership, messages, inviteUrl, close, onDisconnect }: Props) {
  return (
    <Modal dismissible size="lg" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>
        <ModalTitle context="Account" action="Discord notifications settings" />
      </ModalHeader>
      <ModalBody>
        <div className="space-y-5">
          <DiscordAccountHeader
            identity={identity}
            membership={membership}
            inviteUrl={inviteUrl}
            onDisconnect={onDisconnect}
          />

          <DiscordMessagesDrawer messages={messages} />
        </div>
      </ModalBody>
    </Modal>
  );
}
