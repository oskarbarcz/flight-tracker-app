import { toast } from "react-toastify";

export default function showFormSubmitErrorToast(message: string) {
  toast.error(message, {
    autoClose: 5000,
    closeOnClick: true,
    draggable: true,
  });
}
