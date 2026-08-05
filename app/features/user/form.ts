export type ChangePasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export function initChangePasswordData(): ChangePasswordFormData {
  return {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
}
