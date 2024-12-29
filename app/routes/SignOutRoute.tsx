'use client';

import React, {useEffect} from "react";
import {Navigate} from "react-router";
import { useAuth} from "~/state/contexts/auth.context";

export default function SignOutRoute() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  });

  return <Navigate to="/sign-in" replace={true} />;
}