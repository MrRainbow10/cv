"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { useJobs } from "@/lib/use-jobs";
import { TRACK, STATUS_COLORS } from "@/lib/sample-data";
import JobCard from "@/components/JobCard";

const FILTERS = ["Date", "Location", "Workplace", "Degree", "Max experience", "Role", "Job type", "Employment", "More"];

export default function Dashboard() {
  const market = useApp((s) => s.market);
  const toggleMarket = useApp((s) => s.toggleMarket);
  const appliedIds = useApp((s) => s.appliedIds);
  const passedIds = useApp((s) => s.passedIds);
  const apply = useApp((s) => s.apply);
  const showToast = useApp((s) => s.showToast);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { jobs: realJobs, loading, error } = useJobs(market, debouncedSearch);

  function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedSearch(e.target.value), 400);
  }

  const jobs = realJobs.filter((j) => !appliedIds.includes(j.id) && !passedIds.includes(j.id));

  const counts = {
    submitted: TRACK.filter((t) => t.status === "Applied").length + appliedIds.length,
    interviewing: TRACK.filter((t) => t.status === "Interviewing").length,
    offers: TRACK.filter((t) => t.status === "Offer").length,
    assessment: TRACK.filter((t) => t.status === "Assessment").length,
    rejected: TRACK.filter((t) => t.status === "Rejected").length,
    ghosted: TRACK.filter((t) => t.status === "Ghosted").length,
  };
  const counters = [
    { val: counts.submitted, label: "Submitted", fg: "#1A3C2E" },
    { val: counts.interviewing, label: "Interviewing", fg: "#047857" },
    { val: counts.offers, label: "Offers", fg: "#10B981" },
    { val: counts.assessment, label: "Assessment", fg: "#B45309" },
    { val: counts.rejected, label: "Rejected", fg: "#B91C1C" },
    { val: counts.ghosted, label: "Ghosted", fg: "#6B7280" },
  ];

  function applyAll() {
    jobs.forEach((j) => apply(j.id, j.title, j.co));
    showToast(`Applied to ${jobs.length} jobs.`);
  }

  return (
    <div className="px-7 pt-6 pb-10 flex flex-col gap-[18px] min-h-full">
      <div className="flex items-center gap-3">
        <input
          value={search}
          onChange={onSearchChange}
          placeholder="Search by title, company…"
          className="flex-1 bg-white border border-mint rounded-[10px] px-3.5 py-2.5 text-sm text-forest outline-none focus:border-emerald"
        />
        <button onClick={toggleMarket} className="bg-white border border-mint rounded-full px-[15px] py-2 text-[13px] font-semibold whitespace-nowrap hover:border-emerald">
          {market === "IN" ? "🇮🇳 India" : "🌍 UK"} ⇄
        </button>
      </div>

      <div className="flex gap-[7px] flex-wrap">
        {FILTERS.map((f) => (
          <button key={f} className="bg-white border border-mint rounded-full px-[13px] py-1.5 text-xs font-medium text-gray-600 hover:border-emerald hover:text-forest flex items-center gap-1.5">
            {f} <span className="text-gray-400 text-[10px]">▾</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[1.65fr_1fr] gap-[18px] items-start">
        {/* Matches */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-[19px] font-bold">Top job matches</div>
            <div className="flex gap-2">
              <Link href="/app/browse" className="bg-white border border-mint text-[13px] font-semibold px-3.5 py-2 rounded-[9px] hover:bg-sage">Add your own</Link>
              <Link href="/app/browse" className="bg-white border border-mint text-[13px] font-semibold px-3.5 py-2 rounded-[9px] hover:bg-sage">Browse jobs</Link>
              {jobs.length > 0 && (
                <button onClick={applyAll} className="bg-emerald text-white text-[13px] font-semibold px-[15px] py-2 rounded-[9px] hover:brightness-[0.93]">Apply to all {jobs.length}</button>
              )}
            </div>
          </div>
          {loading ? (
            <div className="bg-white border border-dashed border-mint rounded-[14px] py-12 px-6 flex flex-col items-center gap-2.5">
              <div className="w-6 h-6 border-2 border-emerald border-t-transparent rounded-full animate-spin" />
              <div className="text-[13px] text-muted">Loading real jobs…</div>
            </div>
          ) : error ? (
            <div className="bg-white border border-red-200 rounded-[14px] py-8 px-6 flex flex-col items-center gap-2">
              <div className="text-[15px] font-semibold text-red-600">Couldn&apos;t load jobs</div>
              <div className="text-[13px] text-muted">{error}</div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white border border-dashed border-mint rounded-[14px] py-12 px-6 flex flex-col items-center gap-2.5">
              <div className="w-[52px] h-[52px] rounded-full bg-sage border border-mint flex items-center justify-center"><div className="w-[18px] h-[18px] rounded bg-mint" /></div>
              <div className="text-[15px] font-semibold">No matches right now</div>
              <div className="text-[13px] text-muted">Try a different search or check back later.</div>
              <Link href="/app/browse" className="bg-emerald text-white text-[13px] font-semibold px-4 py-2 rounded-[9px] mt-1 hover:brightness-[0.93]">Browse jobs</Link>
            </div>
          ) : (
            jobs.map((j) => <JobCard key={j.id} job={j} market={market} />)
          )}
        </div>

        {/* Tracker summary */}
        <div className="flex flex-col gap-3 sticky top-6">
          <div className="flex items-center justify-between">
            <div className="text-[19px] font-bold">Tracker</div>
            <Link href="/app/tracker" className="text-[13px] font-semibold text-emerald">Open tracker →</Link>
          </div>
          <div className="bg-white border border-mint rounded-[14px] p-[18px] flex flex-col gap-3.5">
            <div className="grid grid-cols-3 gap-2">
              {counters.map((c) => (
                <div key={c.label} className="bg-sage rounded-[9px] px-[11px] py-2.5 flex flex-col gap-0.5">
                  <div className="text-[19px] font-bold" style={{ color: c.fg }}>{c.val}</div>
                  <div className="text-[11px] text-muted">{c.label}</div>
                </div>
              ))}
            </div>
            <button className="bg-emerald text-white text-[13px] font-semibold py-2.5 rounded-[9px] hover:brightness-[0.93]">Approve all</button>
            <div className="flex flex-col gap-[11px]">
              {TRACK.slice(0, 4).map((r) => {
                const c = STATUS_COLORS[r.status];
                return (
                  <div key={r.id} className="flex justify-between items-center gap-2.5">
                    <div className="flex flex-col min-w-0">
                      <div className="text-[13px] font-semibold truncate">{r.co}</div>
                      <div className="text-[11px] text-muted truncate">{r.role} · {r.date}</div>
                    </div>
                    <div className="text-[11px] font-semibold px-2.5 py-[3px] rounded-full flex-shrink-0" style={{ background: c.bg, color: c.fg }}>{r.status}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
