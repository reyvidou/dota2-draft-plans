import { useEffect } from "react";
import { useDraftStore } from "../stores/store";
import { fetchHeroes } from "../services/opendota";

export function useFetchHeroes() {
  const setHeroes = useDraftStore((state) => state.setHeroes);
  const setLoadingHeroes = useDraftStore((state) => state.setLoadingHeroes);
  const loadingHeroes = useDraftStore((state) => state.loadingHeroes);
  const setApiError = useDraftStore((state) => state.setApiError);
  const heroes = useDraftStore((state) => state.heroes);

  useEffect(() => {
    if (heroes.length > 0) {
      setLoadingHeroes(false);
      return;
    }

    let isMounted = true;

    const loadData = async () => {
      setLoadingHeroes(true);
      try {
        const data = await fetchHeroes();
        if (isMounted) {
          setHeroes(data);
        }
      } catch (error) {
        if (isMounted) {
          setApiError(
            "Failed to connect to OpenDota API. Please check your connection or try again later.",
          );
        }
      } finally {
        if (isMounted) {
          setLoadingHeroes(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [heroes.length, setHeroes, setLoadingHeroes]);

  const apiError = useDraftStore((state) => state.apiError);
  return { loadingHeroes, apiError };
}
