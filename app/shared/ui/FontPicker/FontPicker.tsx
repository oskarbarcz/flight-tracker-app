import { Select } from "flowbite-react";
import { useEffect } from "react";
import { useLocalStorage } from "~/shared/hooks/useLocalStorage";

const previewFonts = ["Source Sans 3", "Inter", "IBM Plex Sans", "Noto Sans", "Work Sans", "Barlow", "DM Sans"];

const fontAxis = "ital,wght@0,400;0,500;0,600;0,700;0,800;1,400";

function fontStack(font: string): string {
  return `"${font}", sans-serif`;
}

function loadFontStylesheet(font: string): void {
  const id = `font-preview-${font.replaceAll(" ", "-").toLowerCase()}`;

  if (document.getElementById(id)) {
    return;
  }

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${font.replaceAll(" ", "+")}:${fontAxis}&display=swap`;
  document.head.appendChild(link);
}

export function FontPicker() {
  const [font, setFont] = useLocalStorage<string>("font_preview", "Noto Sans");

  useEffect(() => {
    loadFontStylesheet(font);
    document.documentElement.style.setProperty("--font-sans", fontStack(font));
    document.documentElement.style.setProperty("--font-display", fontStack(font));
  }, [font]);

  return (
    <aside className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-lg border border-gray-200 bg-white/95 p-2 shadow-lg backdrop-blur md:bottom-4 dark:border-gray-700 dark:bg-gray-900/95">
      <Select
        sizing="sm"
        value={font}
        onChange={(event) => setFont(event.target.value)}
        className="w-44"
        style={{ fontFamily: fontStack(font) }}
      >
        {previewFonts.map((name) => (
          <option key={name} value={name} style={{ fontFamily: fontStack(name) }}>
            {name}
          </option>
        ))}
      </Select>
    </aside>
  );
}
