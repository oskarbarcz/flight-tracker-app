import React from "react";
import { useAuth } from "~/app-state/useAuth";
import { NotocIssuedAt } from "~/features/notoc/components/NotocIssuedAt";
import { UserName } from "~/features/user/components/UserName";

type Props = {
  acknowledgedById: string | null;
  acknowledgedAt: string | null;
};

export function NotocAcknowledgement({ acknowledgedById, acknowledgedAt }: Props) {
  const { user } = useAuth();

  if (acknowledgedById === null || acknowledgedAt === null) {
    return null;
  }

  const acknowledger =
    user !== null && user.id === acknowledgedById ? (
      <UserName user={{ id: user.id, name: user.name }} />
    ) : (
      "the operating crew"
    );

  return (
    <p className="text-xs text-gray-500 dark:text-gray-400">
      Accepted by {acknowledger} on <NotocIssuedAt at={acknowledgedAt} />.
    </p>
  );
}
