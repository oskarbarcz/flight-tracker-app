"use client";

import { Toast, ToastToggle } from "flowbite-react";
import React from "react";
import {
  HiCheck,
  HiExclamation,
  HiInformationCircle,
  HiX,
} from "react-icons/hi";

type ToastType = "success" | "error" | "warning" | "info";

interface FlowbiteToastProps {
  message: string;
  type?: ToastType;
}

export const FlowbiteToast = ({
  message,
  type = "success",
}: FlowbiteToastProps) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
        );
      case "error":
        return (
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <HiX className="h-5 w-5" />
          </div>
        );
      case "warning":
        return (
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-800 dark:text-orange-200">
            <HiExclamation className="h-5 w-5" />
          </div>
        );
      case "info":
        return (
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200">
            <HiInformationCircle className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <Toast>
      {getIcon()}
      <div className="ml-3 text-sm font-normal">{message}</div>
      <ToastToggle />
    </Toast>
  );
};
