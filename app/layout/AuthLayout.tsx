"use client";

import React from "react";
import { Outlet } from "react-router";
import Footer from "~/components/Layout/Footer";

const AuthLayout = () => {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
};

export default AuthLayout;
