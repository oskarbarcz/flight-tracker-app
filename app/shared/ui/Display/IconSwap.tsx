import React from "react";

type Props<K extends string> = {
  current: K;
  icons: Record<K, React.ReactNode>;
};

const LAYER =
  "flex [grid-area:1/1] transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:scale-100 motion-reduce:blur-[0px]";
const SHOWN = "scale-100 opacity-100 blur-[0px]";
const HIDDEN = "scale-[0.25] opacity-0 blur-[4px]";

export function IconSwap<K extends string>({ current, icons }: Props<K>) {
  return (
    <span data-icon-swap="" aria-hidden={true} className="grid place-items-center">
      {(Object.keys(icons) as K[]).map((key) => (
        <span key={key} className={`${LAYER} ${key === current ? SHOWN : HIDDEN}`}>
          {icons[key]}
        </span>
      ))}
    </span>
  );
}
