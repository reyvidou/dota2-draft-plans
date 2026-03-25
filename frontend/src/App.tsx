import { useEffect } from "react";
import type { JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDraftStore } from "./stores/store";
import { useFetchHeroes } from "./hooks/useFetchHeroes";
import PlanList from "./components/PlanList";
import PlanDetail from "./components/PlanDetail";

export default function App(): JSX.Element {
  const { fetchPlans, loadingPlans, heroes, apiError } = useDraftStore();
  const { loadingHeroes, apiError: heroApiError } = useFetchHeroes();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    if (document.getElementById("dota-fonts")) return;
    const link = document.createElement("link");
    link.id = "dota-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);

  if (loadingPlans) {
    return (
      <div className="min-h-screen bg-[#060d18] flex items-center justify-center text-[#4a6080]">
        Loading Workspace...
      </div>
    );
  }

  const displayError = apiError || heroApiError;
  if (displayError && heroes.length === 0) {
    return (
      <div className="min-h-screen bg-[#060d18] flex flex-col items-center justify-center text-[#c8d8f0] gap-4">
        <div className="text-5xl">🔌</div>
        <h2 className="m-0 font-['Rajdhani'] text-[#c84040]">
          Connection Error
        </h2>
        <p className="text-[#4a6080]">{displayError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-[#1e3050] text-white border-none rounded-lg cursor-pointer font-bold hover:bg-[#2a4060] transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Background Hero Loading Toast */}
      {loadingHeroes && (
        <div className="fixed top-4 right-4 bg-[#0a1220] border border-[#1e3050] rounded-lg py-2 px-3.5 text-xs text-[#4a6080] z-[999] shadow-lg">
          Loading heroes from Database Cache...
        </div>
      )}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<PlanList />} />
        <Route path="/plan/:id" element={<PlanDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
