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

export type ChangeEmailFormData = {
  newEmail: string;
  currentPassword: string;
};

export function initChangeEmailData(): ChangeEmailFormData {
  return {
    newEmail: "",
    currentPassword: "",
  };
}
