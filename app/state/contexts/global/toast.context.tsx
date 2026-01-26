import React, { createContext, useCallback, useContext } from "react";
import { ToastOptions, toast } from "react-toastify";
import { FlowbiteToast } from "~/components/shared/Toasts/FlowbiteToast";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastContextType {
  showToast: (
    message: string,
    type?: ToastType,
    options?: ToastOptions,
  ) => void;
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const showToast = useCallback(
    (message: string, type: ToastType = "info", options?: ToastOptions) => {
      const toastFn = toast[type] || toast.info;
      toastFn(<FlowbiteToast message={message} type={type} />, {
        icon: false,
        ...options,
      });
    },
    [],
  );

  const success = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, "success", options);
    },
    [showToast],
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, "error", options);
    },
    [showToast],
  );

  const warning = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, "warning", options);
    },
    [showToast],
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, "info", options);
    },
    [showToast],
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
