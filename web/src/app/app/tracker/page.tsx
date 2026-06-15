"use client";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { TRACK, STATUS_COLORS } from "@/lib/sample-data";
import { logoStyle } from "@/lib/jobs";
import { supabaseBrowser } from "@/lib/supabase";
import type { TrackRow, TrackStatus } from "@/lib/types";

const TABS: (TrackStatus | "All")[] = ["All", "Applied", "Interviewing", "Assessment", "Offer", "Ghosted", "Rejected"];

const STATUS_MAP: Record<string, TrackStatus> = {
  submitted: "Applied", pending: "Applied", interviewing: "Interviewing",
  assessment: "Assessment", offer: "Offer", ghosted: "Ghosted", rejected: "Rejected",
};

export default function Tracker() {
  const market = useApp((s) => s.market);
  const toggleMarket = useApp((s) => s.toggleMarket);
  const showToast = useApp((s) => s.showToast);
  const [tab, setTab] = useState<TrackStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [dbRows, setDbRows] = useState<TrackRow[] | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.from("applications").select("*").order("applied_at", { ascending: false }).then(({ data }) => {
      if (!data) { setDbRows([]); return; }
      setDbRows(data.map((a) => ({
        id: a.id,
        co: a.company || "—",
        role: a.job_title || "—",
        logo: (a.company || "??").slice(0, 2).toUpperCase(),
        dark: false,
        status: STATUS_MAP[a.status] || "Applied",
        date: new Date(a.applied_at).toLocaleDateString(),
      })));
    });
  }, []);

  const source = dbRows && dbRows.length > 0 ? dbRows : TRACK;
  const rows = source
    .filter((r) => tab === "All" || r.status === tab)
    .filter((r) => !search || (r.co + r.role).toLowerCase().includes(search.toLowerCase()));

  const counts: Record<string, number> = { All: source.length };
  source.forEach((r) => { counts[r.status] = (counts[r.status] || 0) + 1; });

  return (
    <div className="px-7 pt-6 pb-10 flex flex-col gap-4 min-h-full">
      <div className="flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies or roles…"
          className="flex-1 bg-white border border-mint rounded-[10px] px-3.5 py-2.5 text-sm text-forest outline-none focus:border-emerald"
        />
        <button onClick={toggleMarket} className="bg-white border border-mint rounded-full px-[15px] py-2 text-[13px] font-semibold whitespace-nowrap hover:border-emerald">
          {market === "IN" ? "🇮🇳 India" : "🌍 UK"} ⇄
        </button>
      </div>

      <div className="flex gap-1.5 flex-wrap items-center">
        {TABS.map((t) => {
          const sel = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: sel ? "#1A3C2E" : "#FFFFFF",
                color: sel ? "#FFFFFF" : "#1A3C2E",
                borderColor: sel ? "#1A3C2E" : "#D1FAE5",
              }}
              className="text-[13px] font-semibold px-[15px] py-[7px] rounded-full border flex items-center gap-2 hover:border-emerald"
            >
              {t}
              <span style={{ background: sel ? "#FFFFFF22" : "#F0FAF4", color: sel ? "#FFFFFF" : "#6B7280" }} className="rounded-[5px] px-1.5 text-[11px] font-bold">{counts[t] || 0}</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button onClick={() => showToast("CSV import — coming soon.")} className="bg-white border border-mint text-[13px] font-semibold px-3.5 py-2 rounded-[9px] hover:bg-sage">📥 Import CSV</button>
        <button onClick={() => showToast("Add application — coming soon.")} className="bg-emerald text-white text-[13px] font-semibold px-[15px] py-2 rounded-[9px] hover:brightness-[0.93]">+ Add application</button>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white border border-dashed border-mint rounded-[14px] py-16 px-8 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-sage border border-mint flex items-center justify-center"><div className="w-5 h-5 rounded-md bg-mint" /></div>
          <div className="text-base font-semibold">No applications yet</div>
          <div className="text-[13px] text-muted max-w-[340px]">Start applying from Browse Jobs — you can track everything here.</div>
        </div>
      ) : (
        rows.map((r) => {
          const logo = logoStyle(r.dark);
          const c = STATUS_COLORS[r.status];
          return (
            <div key={r.id} className="bg-white border border-mint rounded-xl px-4 py-3.5 grid grid-cols-[36px_1.5fr_1.2fr_100px_auto] gap-3.5 items-center">
              <div className="w-9 h-9 rounded-[9px] text-[11px] font-semibold flex items-center justify-center flex-shrink-0 border" style={{ background: logo.bg, color: logo.fg, borderColor: logo.bd }}>{r.logo}</div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="text-sm font-bold truncate">{r.co}</div>
                <div className="text-[11px] text-muted truncate">{r.role} · {r.date}</div>
              </div>
              <div className="text-xs text-muted truncate">{r.status}</div>
              <div className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-center" style={{ background: c.bg, color: c.fg }}>{r.status}</div>
              <div className="text-xs text-muted">{r.date}</div>
            </div>
          );
        })
      )}
    </div>
  );
}
