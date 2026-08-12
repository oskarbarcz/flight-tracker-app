import { type ObjectSchema, object, string } from "yup";
import type { DisconnectAccountFormData } from "~/features/auth/form";

export const disconnectAccountSchema: ObjectSchema<DisconnectAccountFormData> = object({
  currentPassword: string().required("Enter your current password"),
});
