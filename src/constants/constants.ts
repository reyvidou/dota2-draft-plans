import type { Priority, Role } from "../types/types";

export const OPENDOTA_HEROES = "https://api.opendota.com/api/heroes";

export const HERO_IMG = (name: string): string =>
  `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${name}.png`;

export const PRIORITY_COLORS: Record<Priority, string> = {
  High: "#ff4444",
  Medium: "#ffaa00",
  Low: "#44cc88",
};

export const ROLES: Role[] = [
  "Carry",
  "Mid",
  "Offlane",
  "Soft Support",
  "Hard Support",
  "Flex",
];

export const ATTR_COLORS: Record<string, string> = {
  str: "#c84040",
  agi: "#40c880",
  int: "#4080c8",
  all: "#c0a040",
};
