import { HiOutlineUser } from "react-icons/hi2";
import { useAuth } from "~/app-state/useAuth";
import { GoogleAccountSection } from "~/features/auth/components/GoogleAccountSection";
import { roleToLabel } from "~/features/user/lib/roleToLabel";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { MetaRow } from "~/shared/ui/Display/MetaRow";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

export default function AccountRoute() {
  usePageTitle("Account");
  const { user } = useAuth();

  if (user === null) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <SectionHeader title="Account" />

      <Container>
        <ContainerTitle icon={HiOutlineUser} title="Identity" />

        <div className="space-y-2 text-sm">
          <MetaRow label="Name" value={user.name} />
          <MetaRow label="Role" value={roleToLabel(user.role)} />
          <MetaRow label="Email" value={user.email} />
        </div>
      </Container>

      <GoogleAccountSection />
    </div>
  );
}
