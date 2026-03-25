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
      <div
        style={{
          minHeight: "100vh",
          background: "#060d18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#4a6080",
        }}
      >
        Loading Workspace...
      </div>
    );
  }

  const displayError = apiError || heroApiError;
  if (displayError && heroes.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#060d18",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#c8d8f0",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 48 }}>🔌</div>
        <h2
          style={{
            margin: 0,
            fontFamily: "'Rajdhani', sans-serif",
            color: "#c84040",
          }}
        >
          Connection Error
        </h2>
        <p style={{ color: "#4a6080" }}>{displayError}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            background: "#1e3050",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <>
      {loadingHeroes && (
        <div
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            background: "#0a1220",
            border: "1px solid #1e3050",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 12,
            color: "#4a6080",
            zIndex: 999,
          }}
        >
          Loading heroes from Database Cache...
        </div>
      )}

      <Routes>
        <Route path="/" element={<PlanList />} />
        <Route path="/plan/:id" element={<PlanDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
