"use client";

import React from "react";
import Container from "~/components/shared/Layout/Container";
import { User } from "~/models/user.model";
import { useAuth } from "~/state/contexts/session/auth.context";

export default function UserHeader() {
  const { user } = useAuth() as { user: User };

  const [name] = user.name.split(" ");
  return (
    <Container invisible>
      <h2 className="text-3xl text-gray-500 font-bold md:text-4xl">
        Hi <span className="text-indigo-500">{name}</span>, howdy?
      </h2>
    </Container>
  );
}
