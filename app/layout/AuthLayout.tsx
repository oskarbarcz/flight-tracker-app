import React from "react";
import { Outlet } from "react-router";
import { Flowbite } from "flowbite-react";
import { Bounce, ToastContainer } from "react-toastify";

const AuthLayout = () => {
  return (
    <Flowbite>
      <Outlet />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </Flowbite>
  );
};

export default AuthLayout;
