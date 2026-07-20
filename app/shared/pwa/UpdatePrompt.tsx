import { useRegisterSW } from "virtual:pwa-register/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { UpdateToast } from "./UpdateToast";

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (!needRefresh) {
      return;
    }

    toast.info(<UpdateToast onReload={() => updateServiceWorker(true)} />, {
      toastId: "pwa-update",
      icon: false,
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
    });
  }, [needRefresh, updateServiceWorker]);

  return null;
}
