import { roleToLabel } from "~/features/user/lib/roleToLabel";
import type { User } from "~/features/user/model";
import { getInitials } from "~/shared/lib/getInitials";

type Props = {
  user: User;
};

export function AccountIdentity({ user }: Props) {
  return (
    <div className="flex items-center gap-4 px-5 py-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white">
        {getInitials(user.name)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xl font-bold leading-tight text-gray-900 dark:text-white">
          {user.name}
        </span>
        <span className="block truncate text-sm text-gray-500 dark:text-gray-400">{roleToLabel(user.role)}</span>
      </span>
    </div>
  );
}
