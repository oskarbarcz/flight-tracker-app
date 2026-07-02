import React from "react";
import { useAuth } from "~/app-state/useAuth";

type Props = {
  user: { id: string; name: string };
};

export function UserName({ user }: Props) {
  const { user: currentUser } = useAuth();
  const isYou = currentUser?.id === user.id;

  return (
    <span>
      <span className="font-semibold text-gray-800 dark:text-gray-100">{user.name}</span>
      {isYou && <span className="ms-1 text-gray-600 dark:text-gray-300">(you)</span>}
    </span>
  );
}
