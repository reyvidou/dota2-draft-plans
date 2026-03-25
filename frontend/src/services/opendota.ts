import type { OpenDotaHero } from "../types/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function fetchHeroes(): Promise<OpenDotaHero[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/heroes`);

    if (!response.ok) {
      throw new Error(
        `Backend API error: ${response.status} ${response.statusText}`,
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
