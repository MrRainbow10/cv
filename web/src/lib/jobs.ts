import type { Job, Market } from "./types";
import { JOBS } from "./sample-data";

export function jobsForMarket(market: Market): Job[] {
  const m = market === "IN" ? "in" : "uk";
  return JOBS.filter((j) => j.m === m || j.m === "both");
}

export function jobById(id: string | null): Job | null {
  if (!id) return null;
  return JOBS.find((j) => j.id === id) ?? null;
}

export function salaryDisplay(j: Job, market: Market): { text: string; color: string; est: string; sponsorNote: string } {
  if (!j.salary) return { text: "Salary not disclosed", color: "#9CA3AF", est: "", sponsorNote: "" };
  const est = j.est ? (market === "IN" ? j.est.in ?? "" : j.est.uk ?? "") : "";
  const sponsorNote = market === "UK" && j.sponsors ? "· Sponsors visa" : "";
  return { text: j.salary, color: "#1A3C2E", est, sponsorNote };
}

export function logoStyle(dark: boolean): { bg: string; fg: string; bd: string } {
  return dark
    ? { bg: "#1A3C2E", fg: "#FFFFFF", bd: "#1A3C2E" }
    : { bg: "#F0FAF4", fg: "#1A3C2E", bd: "#D1FAE5" };
}
