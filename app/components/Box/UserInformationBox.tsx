"use client";

import { useAuth } from "~/state/contexts/auth.context";
import { User } from "~/models/user.model";
import React from "react";
import { Button } from "flowbite-react";
import { PiSignOutBold } from "react-icons/pi";
import { Link } from "react-router";

export default function UserInformationBox() {
  const { user } = useAuth() as { user: User };
  return (
    <section className="col-span-1 flex justify-between md:col-span-2">
      <div>
        <h2 className="text-3xl font-bold text-indigo-500 md:text-4xl">
          {user.name}
        </h2>
        <span className="mt-1 block text-gray-600">{user.email}</span>
      </div>
      <div>
        <Button
          pill
          size="xs"
          color="failure"
          as={Link}
          to={"/sign-out"}
          replace
          viewTransition
        >
          Sign out
          <PiSignOutBold className="ms-2 size-4" />
        </Button>
      </div>
    </section>
  );
}
