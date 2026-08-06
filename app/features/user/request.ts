import type { User } from "~/features/user";

export type GetUserResponse = User;
export type ListUsersResponse = User[];

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type RequestEmailChangeRequest = {
  newEmail: string;
  currentPassword: string;
};

export type ConfirmEmailChangeRequest = {
  token: string;
};
