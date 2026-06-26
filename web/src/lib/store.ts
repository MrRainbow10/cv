"use client";
import { create } from "zustand";
import type { Market } from "./types";
import { supabaseBrowser } from "./supabase";

type AppState = {
  market: Market;
  setMarket: (m: Market) => void;
  toggleMarket: () => void;

  appliedIds: string[];
  passedIds: string[];
  apply: (id: string, jobTitle?: string, company?: string) => void;
  pass: (id: string) => void;

  jobCache: Record<string, import("./types").Job>;
  cacheJob: (job: import("./types").Job) => void;

  toast: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;

  detailJobId: string | null;
  openDetail: (id: string) => void;
  closeDetail: () => void;

  whatsappOpen: boolean;
  openWhatsapp: () => void;
  closeWhatsapp: () => void;
};

export const useApp = create<AppState>((set, get) => ({
  market: "IN",
  setMarket: (m) => set({ market: m }),
  toggleMarket: () => set({ market: get().market === "IN" ? "UK" : "IN" }),

  appliedIds: [],
  passedIds: [],
  jobCache: {},
  cacheJob: (job) => set((s) => ({ jobCache: { ...s.jobCache, [job.id]: job } })),
  apply: (id, jobTitle, company) => {
    if (get().appliedIds.includes(id)) return;
    set({ appliedIds: [...get().appliedIds, id], toast: "Application queued." });
    setTimeout(() => get().clearToast(), 2500);
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("applications").insert({
        user_id: user.id,
        external_job_id: id,
        job_title: jobTitle || null,
        company: company || null,
        status: "submitted",
      });
    });
  },
  pass: (id) => {
    set({ passedIds: [...get().passedIds, id], toast: "Passed." });
    setTimeout(() => get().clearToast(), 2000);
  },

  toast: null,
  showToast: (msg) => {
    set({ toast: msg });
    setTimeout(() => get().clearToast(), 2500);
  },
  clearToast: () => set({ toast: null }),

  detailJobId: null,
  openDetail: (id) => set({ detailJobId: id }),
  closeDetail: () => set({ detailJobId: null }),

  whatsappOpen: false,
  openWhatsapp: () => set({ whatsappOpen: true }),
  closeWhatsapp: () => set({ whatsappOpen: false }),
}));
