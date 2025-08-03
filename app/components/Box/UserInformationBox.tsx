"use client";

import { useAuth } from "~/state/contexts/auth.context";
import { User } from "~/models/user.model";
import React from "react";
import Container from "~/components/Layout/Container";

export default function UserInformationBox() {
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
