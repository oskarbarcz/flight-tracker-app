import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router";
import type { Flight } from "~/features/flight";
import { FiledRoute } from "~/features/route/components/FiledRoute/FiledRoute";
import { useFiledRouteTokens } from "~/features/route/hooks/useFiledRouteTokens";
import { useRouteBriefingState } from "~/features/route/hooks/useRouteBriefing";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  flight: Flight;
  briefingHref?: string;
};

export function FiledRouteCard({ flight, briefingHref }: Props) {
  const { briefing, runways } = useRouteBriefingState();
  const tokens = useFiledRouteTokens(flight, briefing?.route ?? null, runways);

  if (tokens.length === 0) {
    return null;
  }

  const briefingLink =
    briefingHref === undefined ? undefined : (
      <Link
        to={briefingHref}
        viewTransition
        className="group inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
      >
        Route briefing
        <FaArrowRight
          className="size-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          aria-hidden={true}
        />
      </Link>
    );

  return (
    <Container padding="spacious" header={<CardHeader title="Route" />}>
      <FiledRoute tokens={tokens} selectedOrdinal={null} trailing={briefingLink} />
    </Container>
  );
}
