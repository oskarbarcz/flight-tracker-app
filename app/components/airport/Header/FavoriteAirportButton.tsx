"use client";

import { Button } from "flowbite-react";
import React from "react";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import { useLocalStorage } from "~/state/app/hooks/useLocalStorage";

const FAVORITES_KEY = "favorite_airports";

type Props = {
  airportId: string;
};

export function FavoriteAirportButton({ airportId }: Props) {
  const [favorites, setFavorites] = useLocalStorage<string[]>(FAVORITES_KEY, []);
  const isFavorite = favorites.includes(airportId);

  const toggle = () => {
    setFavorites((prev) => (prev.includes(airportId) ? prev.filter((id) => id !== airportId) : [...prev, airportId]));
  };

  return (
    <Button
      onClick={toggle}
      size="sm"
      color={isFavorite ? "indigo" : "light"}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite}
    >
      {isFavorite ? <HiHeart className="size-4" /> : <HiOutlineHeart className="size-4" />}
    </Button>
  );
}
