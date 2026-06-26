"use client";
import { useRef, useState } from "react";
import { useApp } from "@/lib/store";
import { useJobs } from "@/lib/use-jobs";
import JobCard from "@/components/JobCard";

const FILTERS_COMMON = ["Date", "Location", "Workplace", "Degree", "Max experience", "Role", "Job type", "Employment", "More"];

export default function Browse() {
  const market = useApp((s) => s.market);
  const appliedIds = useApp((s) => s.appliedIds);
  const passedIds = useApp((s) => s.passedIds);
  const showToast = useApp((s) => s.showToast);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickUrl, setQuickUrl] = useState("");
  const [quickJd, setQuickJd] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { jobs: realJobs, loading, error } = useJobs(market, debouncedSearch);

  function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedSearch(e.target.value), 400);
  }

  const filters = [...FILTERS_COMMON];
  if (market === "UK") filters.splice(5, 0, "Sponsors visa");
  filters.splice(2, 0, market === "IN" ? "CTC range" : "Salary range");

  const jobs = realJobs.filter((j) => !appliedIds.includes(j.id) && !passedIds.includes(j.id));

  return (
    <div className="px-7 pt-6 pb-10 flex flex-col gap-4 min-h-full">
      <div className="flex flex-col gap-3">
        <input
          value={search}
          onChange={onSearchChange}
          placeholder="Search by title, company…"
          className="w-full bg-white border border-mint rounded-[10px] px-3.5 py-2.5 text-sm text-forest outline-none focus:border-emerald"
        />
        <div className="flex gap-[7px] flex-wrap">
          {filters.map((f) => (
            <button key={f} className="bg-white border border-mint rounded-full px-[13px] py-1.5 text-xs font-medium text-gray-600 hover:border-emerald hover:text-forest flex items-center gap-1.5">
              {f} <span className="text-gray-400 text-[10px]">▾</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-mint rounded-xl px-4 py-3.5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Workday, Greenhouse etc. — Add Your Own Link</div>
          <button onClick={() => setQuickOpen(!quickOpen)} className="text-[22px] opacity-50 hover:opacity-100">{quickOpen ? "−" : "+"}</button>
        </div>
        {quickOpen && (
          <div className="flex gap-2">
            <input value={quickUrl} onChange={(e) => setQuickUrl(e.target.value)} placeholder="Paste the job link here…" className="flex-1 min-w-0 bg-gray-50 border border-mint rounded-[9px] px-3 py-2.5 text-[13px] outline-none focus:border-emerald" />
            <textarea value={quickJd} onChange={(e) => setQuickJd(e.target.value)} rows={1} placeholder="Optional: paste the job description…" className="flex-1 min-w-0 bg-gray-50 border border-mint rounded-[9px] px-3 py-2.5 text-[13px] outline-none focus:border-emerald resize-y" />
            <button onClick={() => { showToast("Quick application queued."); setQuickUrl(""); setQuickJd(""); }} className="bg-emerald text-white text-xs font-semibold px-[15px] py-2.5 rounded-[9px] whitespace-nowrap hover:brightness-[0.93]">Quick Apply</button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-white border border-mint rounded-[10px] px-4 py-2.5 text-[13px] font-semibold">Saved · 0</div>
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
        <div className="bg-white border border-dashed border-mint rounded-[14px] py-16 px-8 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-sage border border-mint flex items-center justify-center"><div className="w-5 h-5 rounded-md bg-mint" /></div>
          <div className="text-base font-semibold">No jobs in your search</div>
          <div className="text-[13px] text-muted max-w-[340px]">Try broadening your filters, or add a job link from any ATS platform yourself.</div>
        </div>
      ) : (
        jobs.map((j) => <JobCard key={j.id} job={j} market={market} />)
      )}
    </div>
  );
}
