import { create } from "zustand";
import type { DraftPlan, OpenDotaHero } from "../types/types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface DraftStore {
  plans: DraftPlan[];
  heroes: OpenDotaHero[];
  loadingHeroes: boolean;
  loadingPlans: boolean;
  apiError: string | null;

  fetchPlans: () => Promise<void>;
  createPlan: (name: string, desc: string, id: string) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  updatePlan: (plan: DraftPlan) => Promise<void>;

  setHeroes: (heroes: OpenDotaHero[]) => void;
  setLoadingHeroes: (v: boolean) => void;
  setApiError: (err: string | null) => void;
}

export const uid = (): string => crypto.randomUUID();

export const useDraftStore = create<DraftStore>((set, get) => ({
  plans: [],
  heroes: [],
  loadingHeroes: true,
  loadingPlans: true,
  apiError: null,

  fetchPlans: async () => {
    set({ loadingPlans: true });
    try {
      const res = await fetch(`${API_BASE}/api/plans`);
      if (!res.ok) throw new Error("Failed to fetch plans");

      const rawData = await res.json();

      const mappedPlans: DraftPlan[] = rawData.map((dbRow: any) => ({
        id: dbRow.id,
        name: dbRow.name,
        desc: dbRow.description,
        createdAt: dbRow.created_at,
        bans: dbRow.bans || [],
        picks: dbRow.picks || [],
        threats: dbRow.threats || [],
        timings: dbRow.timings || [],
      }));

      set({ plans: mappedPlans, loadingPlans: false, apiError: null });
    } catch (err) {
      set({
        apiError: "Failed to load draft plans from database.",
        loadingPlans: false,
      });
    }
  },

  createPlan: async (name: string, desc: string, id: string) => {
    const plan: DraftPlan = {
      id,
      name,
      desc,
      createdAt: Date.now(),
      bans: [],
      picks: [],
      threats: [],
      timings: [],
    };

    set((s) => ({ plans: [plan, ...s.plans] }));

    try {
      const res = await fetch(`${API_BASE}/api/plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      });
      if (!res.ok) throw new Error("Database rejection");
    } catch (err) {
      set((s) => ({
        plans: s.plans.filter((p) => p.id !== id),
        apiError: "Failed to save plan to database.",
      }));
    }
  },

  deletePlan: async (id: string) => {
    const previousPlans = get().plans;
    set((s) => ({ plans: s.plans.filter((p) => p.id !== id) }));

    try {
      const res = await fetch(`${API_BASE}/api/plans/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Database rejection");
    } catch (err) {
      set({ plans: previousPlans, apiError: "Failed to delete plan." });
    }
  },

  updatePlan: async (plan: DraftPlan) => {
    const previousPlans = get().plans;
    set((s) => ({ plans: s.plans.map((p) => (p.id === plan.id ? plan : p)) }));

    try {
      const res = await fetch(`${API_BASE}/api/plans/${plan.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      });
      if (!res.ok) throw new Error("Database rejection");
    } catch (err) {
      set({ plans: previousPlans, apiError: "Failed to sync updates." });
    }
  },

  setHeroes: (heroes) => set({ heroes }),
  setLoadingHeroes: (v) => set({ loadingHeroes: v }),
  setApiError: (err) => set({ apiError: err }),
}));
