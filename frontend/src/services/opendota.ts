import type { OpenDotaHero } from "../types/types";
import { OPENDOTA_HEROES } from "../constants/constants";

export async function fetchHeroes(): Promise<OpenDotaHero[]> {
  try {
    const response = await fetch(OPENDOTA_HEROES);

    if (!response.ok) {
      throw new Error(
        `OpenDota API error: ${response.status} ${response.statusText}`,
      );
    }

    const data: OpenDotaHero[] = await response.json();

    return data.sort((a, b) =>
      a.localized_name.localeCompare(b.localized_name),
    );
  } catch (error) {
    console.error("Failed to fetch heroes:", error);
    throw error;
  }
}
