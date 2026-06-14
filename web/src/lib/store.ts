"use client";
import { create } from "zustand";
import type { Market } from "./types";

type AppState = {
  market: Market;
  setMarket: (m: Market) => void;
  toggleMarket: () => void;

  appliedIds: string[];
  passedIds: string[];
  apply: (id: string) => void;
  pass: (id: string) => void;

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
  apply: (id) => {
    if (get().appliedIds.includes(id)) return;
    set({ appliedIds: [...get().appliedIds, id], toast: "Application queued." });
    setTimeout(() => get().clearToast(), 2500);
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
