import type { WeatherSource } from "~/features/airport/model";
import type { DiscordAuthorizationRequest } from "~/features/auth";
import type { DiscordJoinOutcome, DiscordServerMembershipStatus, SimbriefAccount, User } from "~/features/user";

export type GetUserResponse = User;
export type ListUsersResponse = User[];
export type VerifySimbriefUserResponse = SimbriefAccount;

export type UpdateOwnProfileRequest = {
  defaultWeatherSource?: WeatherSource;
  simbriefUserId?: string | null;
};

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

export type LinkDiscordAccountRequest = DiscordAuthorizationRequest & {
  joinServer: boolean;
};

export type LinkDiscordAccountResponse = {
  linked: boolean;
  userId: string;
  username: string;
  globalName: string | null;
  avatarUrl: string | null;
  joinOutcome: DiscordJoinOutcome;
};

export type UnlinkAccountRequest = {
  currentPassword: string;
};

export type DiscordServerMembershipResponse = {
  status: DiscordServerMembershipStatus;
};

export type DiscordSettingsResponse = {
  briefingsEnabled: boolean;
  preliminaryLoadsheetEnabled: boolean;
  finalLoadsheetEnabled: boolean;
  delayUpdatesEnabled: boolean;
};

export type UpdateDiscordSettingsRequest = Partial<DiscordSettingsResponse>;
