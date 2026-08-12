import { DiscordSignInButton } from "~/features/auth/components/DiscordSignInButton";
import { useGoogleIdentity } from "~/features/auth/hooks/useGoogleIdentity";
import { getDiscordClientId } from "~/shared/lib/getDiscordClientId";
import { LabeledDivider } from "~/shared/ui/Layout/LabeledDivider";

type Props = {
  blocked: boolean;
  onGoogleCredential: (idToken: string) => void;
};

export function ThirdPartySignIn({ blocked, onGoogleCredential }: Props) {
  const { containerRef, status } = useGoogleIdentity({ text: "signin_with", onCredential: onGoogleCredential });
  const hasDiscord = getDiscordClientId() !== null;
  const hasGoogle = status !== "unconfigured" && status !== "unavailable";

  if (!hasGoogle && !hasDiscord) {
    return null;
  }

  const awaitingGoogle = !hasDiscord && status !== "ready";

  return (
    <div className={`flex flex-col gap-4 ${awaitingGoogle ? "opacity-0" : ""}`}>
      <LabeledDivider label="or" />

      {hasGoogle && (
        <div
          ref={containerRef}
          className={`flex min-h-10 justify-center ${status === "ready" ? "" : "opacity-0"} ${
            blocked ? "pointer-events-none" : ""
          }`}
        />
      )}

      {hasDiscord && <DiscordSignInButton blocked={blocked} />}
    </div>
  );
}
