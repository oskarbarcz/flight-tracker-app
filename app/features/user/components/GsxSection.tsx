import { GsxSettingsPanel } from "~/features/user/components/GsxSettingsPanel";
import { useGsxSettings } from "~/features/user/hooks/useGsxSettings";
import { gsxSectionId } from "~/features/user/lib/gsxSettings";

export function GsxSection() {
  const gsx = useGsxSettings();

  return (
    <div id={gsxSectionId} className="scroll-mt-20">
      <GsxSettingsPanel gsx={gsx} />
    </div>
  );
}
