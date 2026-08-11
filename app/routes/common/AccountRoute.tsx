import { useAuth } from "~/app-state/useAuth";
import { GoogleAccountSection } from "~/features/auth/components/GoogleAccountSection";
import { AccountIdentity } from "~/features/user/components/AccountIdentity";
import { EmailSection } from "~/features/user/components/EmailSection";
import { PasswordSection } from "~/features/user/components/PasswordSection";
import { WeatherSourceSection } from "~/features/user/components/WeatherSourceSection";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { Container } from "~/shared/ui/Layout/Container";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

export default function AccountRoute() {
  usePageTitle("Account");
  const { user } = useAuth();

  if (user === null) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <SectionHeader title="Account" />

      <Container className="gap-0" padding="none">
        <AccountIdentity user={user} />
        <EmailSection />
        <PasswordSection />
        <GoogleAccountSection />
        <WeatherSourceSection />
      </Container>
    </div>
  );
}
