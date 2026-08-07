import { type ObjectSchema, object, ref, string } from "yup";
import type { ChangeEmailFormData, ChangePasswordFormData } from "~/features/user/form";

export const minimumPasswordLength = 12;

export const passwordPolicyDescription =
  "At least 12 characters, including an uppercase letter, a lowercase letter, a number and a symbol.";

export const changePasswordSchema: ObjectSchema<ChangePasswordFormData> = object({
  currentPassword: string().required("Enter your current password"),
  newPassword: string()
    .required("Enter a new password")
    .min(minimumPasswordLength, `Use at least ${minimumPasswordLength} characters`)
    .matches(/[A-Z]/, "Add an uppercase letter")
    .matches(/[a-z]/, "Add a lowercase letter")
    .matches(/\d/, "Add a number")
    .matches(/[^A-Za-z0-9]/, "Add a symbol"),
  confirmNewPassword: string()
    .required("Repeat your new password")
    .oneOf([ref("newPassword")], "This does not match your new password"),
});

export const changeEmailSchema: ObjectSchema<ChangeEmailFormData> = object({
  newEmail: string().required("Enter the new email address").email("Enter a valid email address"),
  currentPassword: string().required("Enter your current password"),
});
