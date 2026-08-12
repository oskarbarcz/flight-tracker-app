export type DisconnectAccountFormData = {
  currentPassword: string;
};

export function initDisconnectAccountData(): DisconnectAccountFormData {
  return {
    currentPassword: "",
  };
}
