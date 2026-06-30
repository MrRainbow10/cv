"use client";
import { useState } from "react";
import { MSGS, TAG_COLORS } from "@/lib/sample-data";

const TABS = ["All", "Interview", "Assessment", "Offer", "Verification", "Reminder", "Rejection"];

export default function Inbox() {
  const [tab, setTab] = useState("All");
  const [selId, setSelId] = useState<string | null>("m1");

  const counts: Record<string, number> = { All: MSGS.length };
  MSGS.forEach((m) => { counts[m.tag] = (counts[m.tag] || 0) + 1; });

  const visible = tab === "All" ? MSGS : MSGS.filter((m) => m.tag === tab);
  const selected = MSGS.find((m) => m.id === selId);

  return (
    <div className="px-7 pt-6 pb-10 flex flex-col gap-3 h-full overflow-hidden">
      <div className="flex gap-1.5 flex-wrap">
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
              className="text-[13px] font-semibold px-3.5 py-[7px] rounded-full border flex items-center gap-2 hover:border-emerald"
            >
              {t}
              <span style={{ background: sel ? "#FFFFFF22" : "#F0FAF4", color: sel ? "#FFFFFF" : "#6B7280" }} className="rounded-[5px] px-1.5 text-[11px] font-bold">{counts[t] || 0}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-[280px_1fr] gap-4 flex-1 min-h-0 overflow-hidden">
        <div className="flex flex-col border border-mint rounded-xl overflow-hidden bg-white">
          {visible.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-10 h-10 rounded-full bg-sage border border-mint mb-2.5" />
              <div className="text-[13px] text-muted">No messages</div>
            </div>
          ) : (
            visible.map((m) => {
              const sel = selId === m.id;
              const c = TAG_COLORS[m.tag];
              return (
                <button
                  key={m.id}
                  onClick={() => setSelId(m.id)}
                  style={{
                    background: sel ? "#F0FAF4" : "#FFFFFF",
                    borderLeftColor: sel ? "#10B981" : "transparent",
                  }}
                  className="border-b border-mint border-l-[3px] p-3.5 pl-[11px] cursor-pointer hover:bg-gray-50 text-left flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[13px] font-semibold truncate flex-1">{m.from}</div>
                    <div className="text-[11px] font-semibold px-2 py-0.5 rounded flex-shrink-0" style={{ background: c.bg, color: c.fg }}>{m.tag}</div>
                  </div>
                  <div className="text-xs text-muted truncate">{m.subj}</div>
                  <div className="text-[11px] text-gray-400">{m.date}</div>
                </button>
              );
            })
          )}
        </div>

        {selected ? (
          <div className="border border-mint rounded-xl overflow-y-auto bg-white p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-bold">{selected.subj}</div>
                  <div className="text-[11px] font-semibold px-2.5 py-1 rounded flex-shrink-0" style={{ background: TAG_COLORS[selected.tag].bg, color: TAG_COLORS[selected.tag].fg }}>{selected.tag}</div>
                </div>
                <div className="text-[13px] text-gray-600">From: <span className="text-forest font-semibold">{selected.from}</span> <span className="text-gray-400 font-mono text-xs">{selected.addr}</span></div>
                <div className="text-xs text-gray-400">{selected.date}</div>
              </div>
            </div>
            <div className="h-px bg-mint mb-4" />
            <div className="flex flex-col gap-2.5 text-sm leading-[1.6] text-gray-600">
              {selected.body.map((para, i) => <div key={i}>{para}</div>)}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-white border border-mint rounded-xl">
            <div className="w-12 h-12 rounded-full bg-sage border border-mint mb-3" />
            <div className="text-sm font-semibold">No message selected</div>
            <div className="text-[13px] text-muted max-w-[280px] text-center mt-1.5">Messages sent to your inbox address will appear here.</div>
          </div>
        )}
      </div>
    </div>
  );
}
