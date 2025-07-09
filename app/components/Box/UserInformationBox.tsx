"use client";

import { useAuth } from "~/state/contexts/auth.context";
import { User } from "~/models/user.model";
import React from "react";
import Container from "~/components/Container";

export default function UserInformationBox() {
  const { user } = useAuth() as { user: User };
  return (
    <Container>
      <h2 className="text-3xl font-bold text-indigo-500 md:text-4xl">
        {user.name}
      </h2>
      <span className="mt-1 block text-gray-600 dark:text-gray-400">
        {user.email}
      </span>
    </Container>
  );
}
