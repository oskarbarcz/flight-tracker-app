import React, { createContext, useContext } from "react";

type Density = "comfortable" | "compact";

type DensityStyles = {
  inputSizing: "sm" | "md";
  floatingSizing: "sm" | "md";
  fieldClass: string;
  labelClass: string;
  textareaClass: string;
};

const styles: Record<Density, DensityStyles> = {
  comfortable: {
    inputSizing: "md",
    floatingSizing: "md",
    fieldClass: "mb-4 w-full",
    labelClass: "mb-2 block",
    textareaClass: "",
  },
  compact: {
    inputSizing: "sm",
    floatingSizing: "sm",
    fieldClass: "mb-3 w-full",
    labelClass: "mb-1 block",
    textareaClass: "p-2 text-base sm:text-xs",
  },
};

const FormDensityContext = createContext<Density>("comfortable");

export function FormDensityProvider({ density, children }: { density: Density; children: React.ReactNode }) {
  return <FormDensityContext.Provider value={density}>{children}</FormDensityContext.Provider>;
}

export function useFormDensity(): DensityStyles {
  return styles[useContext(FormDensityContext)];
}
