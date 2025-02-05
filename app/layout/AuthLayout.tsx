"use client";

import React from "react";
import { Outlet } from "react-router";
import { Flowbite } from "flowbite-react";
import Footer from "~/components/Layout/Footer";

const AuthLayout = () => {
  return (
    <Flowbite>
      <Outlet />
      <Footer />
    </Flowbite>
  );
};

export default AuthLayout;
