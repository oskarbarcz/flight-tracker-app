import React from "react";
import { Outlet } from "react-router";
import { Flowbite } from "flowbite-react";

const AuthLayout = () => {
  return (
    <Flowbite>
      <Outlet />
    </Flowbite>
  );
};

export default AuthLayout;
