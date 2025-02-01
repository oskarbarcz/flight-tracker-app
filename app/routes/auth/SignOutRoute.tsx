"use client";

import React, { useEffect } from "react";
import { Navigate } from "react-router";
import { useAuth } from "~/state/contexts/auth.context";
import { toast } from "react-toastify";

export default function SignOutRoute() {
  const { signOut } = useAuth();

  useEffect(() => {
    toast.info("You are successfully signed out.", {
      theme: "light",
    });
    signOut();
  });

  return <Navigate to="/sign-in" replace={true} />;
}
