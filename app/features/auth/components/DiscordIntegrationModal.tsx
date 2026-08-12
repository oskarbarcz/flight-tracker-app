import { Badge, Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { FaDiscord } from "react-icons/fa6";
import { DiscordConnectionCard } from "~/features/auth/components/DiscordConnectionCard";
import { DiscordFeatureRow } from "~/features/auth/components/DiscordFeatureRow";
import {
  briefingsFeature,
  type DiscordMembershipState,
  serverMembershipFeature,
} from "~/features/auth/lib/discordFeatures";
import type { DiscordIdentity } from "~/features/user";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  identity: DiscordIdentity;
  membership: DiscordMembershipState;
  inviteUrl: string | null;
  close: () => void;
  onDisconnect: () => void;
};

const membershipBadge: Record<DiscordMembershipState, { color: string; label: string }> = {
  member: { color: "success", label: "In server" },
  not_member: { color: "warning", label: "Not in server" },
  unknown: { color: "gray", label: "Unknown" },
  checking: { color: "gray", label: "Checking" },
};

export function DiscordIntegrationModal({ identity, membership, inviteUrl, close, onDisconnect }: Props) {
  const badge = membershipBadge[membership];
  const showInvite = membership === "not_member" && inviteUrl !== null;

  return (
    <Modal size="lg" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>
        <ModalTitle context="Account" action="Discord integration" />
      </ModalHeader>
      <ModalBody>
        <div className="space-y-3">
          <DiscordConnectionCard identity={identity} membership={membership} />

          <DiscordFeatureRow
            label={briefingsFeature.label}
            description={briefingsFeature.description}
            control={
              <Badge color="indigo" size="xs">
                Always on
              </Badge>
            }
          />

          <DiscordFeatureRow
            label={serverMembershipFeature.label}
            description={serverMembershipFeature.description}
            control={
              <Badge color={badge.color} size="xs">
                {badge.label}
              </Badge>
            }
            footer={
              showInvite && (
                <Button
                  color="alternative"
                  size="xs"
                  as="a"
                  href={inviteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-9 w-fit"
                >
                  <FaDiscord aria-hidden size={14} className="me-2 text-discord dark:text-discord-light" />
                  Join the server
                </Button>
              )
            }
          />
        </div>
      </ModalBody>
      <ModalActions
        cancel={{ label: "Close", onClick: close }}
        confirm={{ label: "Disconnect Discord account", onClick: onDisconnect, tone: "danger" }}
      />
    </Modal>
  );
}
