import brandLogo from "~/assets/logo.svg";
import inverseLogo from "~/assets/logo.white.svg";
import { Wordmark } from "~/shared/ui/Wordmark";

type LogoTone = "brand" | "inverse";
type LogoLayout = "inline" | "panel";

type LogoProps = {
  tone?: LogoTone;
  layout?: LogoLayout;
};

export function Logo({ tone = "brand", layout = "inline" }: LogoProps) {
  const isInverse = tone === "inverse";
  const isPanel = layout === "panel";

  return (
    <div className={isPanel ? "flex items-center gap-2 md:flex-col md:gap-4" : "flex items-center gap-2"}>
      <img src={isInverse ? inverseLogo : brandLogo} alt="" className={isPanel ? "h-7 md:h-16" : "h-6 sm:h-9"} />
      <Wordmark
        className={`${isPanel ? "text-lg md:text-2xl" : "text-xl sm:text-3xl"} ${
          isInverse ? "text-white" : "text-indigo-500"
        }`}
      />
    </div>
  );
}
