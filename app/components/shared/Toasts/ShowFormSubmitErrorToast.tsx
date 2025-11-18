import { Bounce, toast } from "react-toastify";

export default function showFormSubmitErrorToast(message: string) {
  toast.error(message, {
    position: "bottom-center",
    autoClose: 5000,
    closeOnClick: true,
    draggable: true,
    theme: "colored",
    transition: Bounce,
  });
}
