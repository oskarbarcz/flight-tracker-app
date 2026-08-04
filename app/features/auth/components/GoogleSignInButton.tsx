import { useGoogleIdentity } from "~/features/auth/hooks/useGoogleIdentity";
import { LabeledDivider } from "~/shared/ui/Layout/LabeledDivider";

type Props = {
  text: "signin_with" | "continue_with";
  dividerLabel?: string;
  blocked?: boolean;
  onCredential: (idToken: string) => void;
};

export function GoogleSignInButton({ text, dividerLabel, blocked, onCredential }: Props) {
  const { containerRef, status } = useGoogleIdentity({ text, onCredential });

  if (status === "unconfigured" || status === "unavailable") {
    return null;
  }

  return (
    <div className={`flex flex-col gap-4 ${status === "ready" ? "" : "opacity-0"}`}>
      {dividerLabel && <LabeledDivider label={dividerLabel} />}
      <div ref={containerRef} className={`flex min-h-10 justify-center ${blocked ? "pointer-events-none" : ""}`} />
    </div>
  );
}
