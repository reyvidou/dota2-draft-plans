import { create } from "zustand";
import type { StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PersistOptions } from "zustand/middleware";
import type { DraftPlan, OpenDotaHero } from "../types/types";

export interface DraftStore {
  plans: DraftPlan[];
  heroes: OpenDotaHero[];
  loadingHeroes: boolean;
  hydrated: boolean;
  apiError: string | null;

  createPlan: (name: string, desc: string, id: string) => void;
  deletePlan: (id: string) => void;
  updatePlan: (plan: DraftPlan) => void;
  setHeroes: (heroes: OpenDotaHero[]) => void;
  setLoadingHeroes: (v: boolean) => void;
  setHydrated: (v: boolean) => void;
  setApiError: (err: string | null) => void;
}

export const uid = (): string => Math.random().toString(36).slice(2, 10);

type PersistedSlice = Pick<DraftStore, "plans">;

const persistConfig: PersistOptions<DraftStore, PersistedSlice> = {
  name: "dota2_draft_plans_v2",
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ plans: state.plans }),
  onRehydrateStorage: () => (state) => {
    if (state) state.setHydrated(true);
  },
};

const storeSlice: StateCreator<DraftStore> = (set) => ({
  plans: [],
  heroes: [],
  loadingHeroes: true,
  hydrated: false,
  apiError: null,

  createPlan: (name: string, desc: string, id: string) => {
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
  },
  deletePlan: (id: string) => {
    set((s) => ({
      plans: s.plans.filter((p) => p.id !== id),
    }));
  },
  updatePlan: (plan: DraftPlan) => {
    set((s) => ({ plans: s.plans.map((p) => (p.id === plan.id ? plan : p)) }));
  },
  setHeroes: (heroes: OpenDotaHero[]) => set({ heroes }),
  setLoadingHeroes: (v: boolean) => set({ loadingHeroes: v }),
  setHydrated: (v: boolean) => set({ hydrated: v }),
  setApiError: (err: string | null) => set({ apiError: err }),
});

export const useDraftStore = create<DraftStore>()(
  persist(storeSlice, persistConfig),
);
