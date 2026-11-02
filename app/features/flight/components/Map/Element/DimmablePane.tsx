import type { ReactNode } from "react";
import { Pane } from "react-leaflet";

type Props = {
  name: string;
  emphasis: number;
  children: ReactNode;
};

export function DimmablePane({ name, emphasis, children }: Props) {
  if (emphasis >= 1) {
    return <>{children}</>;
  }

  return (
    <Pane name={name} style={{ opacity: emphasis }}>
      {children}
    </Pane>
  );
}
