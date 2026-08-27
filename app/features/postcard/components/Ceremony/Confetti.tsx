import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { prefersReducedMotion } from "~/shared/lib/reducedMotion";

const PIECES = 42;
const LIFETIME_MS = 2200;

const COLORS = ["#6875f5", "#f0b429", "#34d399", "#38bdf8", "#f472b6", "#a78bfa"];

type Piece = {
  id: string;
  color: string;
  size: number;
  drift: number;
  rise: number;
  fall: number;
  spin: number;
  delay: number;
};

function scatter(index: number): Piece {
  const angle = (index / PIECES) * Math.PI * 2;
  const reach = 120 + ((index * 37) % 190);

  return {
    id: `piece-${index}`,
    color: COLORS[index % COLORS.length],
    size: 6 + ((index * 13) % 6),
    drift: Math.cos(angle) * reach,
    rise: -(90 + ((index * 29) % 160)),
    fall: 300 + ((index * 53) % 340),
    spin: (index % 2 === 0 ? 1 : -1) * (240 + ((index * 71) % 460)),
    delay: (index * 17) % 220,
  };
}

const BURST: Piece[] = Array.from({ length: PIECES }, (_, index) => scatter(index));

export function Confetti() {
  const [spent, setSpent] = useState(prefersReducedMotion());

  useEffect(() => {
    if (spent) {
      return;
    }

    const timer = setTimeout(() => setSpent(true), LIFETIME_MS);

    return () => clearTimeout(timer);
  }, [spent]);

  if (spent) {
    return null;
  }

  return createPortal(
    <div className="confetti" aria-hidden={true}>
      {BURST.map((piece) => (
        <span
          key={piece.id}
          className="confetti__piece"
          style={
            {
              "--confetti-color": piece.color,
              "--confetti-size": `${piece.size}px`,
              "--confetti-drift": `${piece.drift}px`,
              "--confetti-rise": `${piece.rise}px`,
              "--confetti-fall": `${piece.fall}px`,
              "--confetti-spin": `${piece.spin}deg`,
              "--confetti-delay": `${piece.delay}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>,
    document.body,
  );
}
