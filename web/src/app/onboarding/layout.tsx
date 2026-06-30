"use client";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

const STEPS = [
  { path: "/onboarding/resume", title: "Resume", sub: "PDF · 30 sec" },
  { path: "/onboarding/about", title: "About you", sub: "Where, contact, eligibility" },
  { path: "/onboarding/setup", title: "Application setup", sub: "How we apply for you" },
];

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const market = useApp((s) => s.market);
  const stepIdx = Math.max(0, STEPS.findIndex((s) => pathname?.startsWith(s.path)));

  return (
    <div className="grid grid-cols-[340px_1fr] h-screen overflow-hidden">
      <aside className="bg-forest text-white px-7 py-8 flex flex-col">
        <div className="flex items-baseline gap-1.5 mb-11">
          <div className="text-[19px] font-bold">obisa</div>
          <div className="w-1.5 h-1.5 rounded-[2px] bg-emerald" />
        </div>
        {STEPS.map((s, i) => {
          const done = i < stepIdx;
          const active = i === stepIdx;
          const cBg = done ? "#10B981" : active ? "#FFFFFF" : "transparent";
          const cBd = done ? "#10B981" : active ? "#FFFFFF" : "#FFFFFF44";
          const cFg = done ? "#FFFFFF" : active ? "#1A3C2E" : "#FFFFFF99";
          const tFg = active ? "#FFFFFF" : done ? "#FFFFFFCC" : "#FFFFFF99";
          const showLine = i < STEPS.length - 1;
          return (
            <div key={s.path} className="flex gap-3.5">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => done && router.push(s.path)}
                  style={{ background: cBg, borderColor: cBd, color: cFg }}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 border-2"
                >
                  {done ? "✓" : i + 1}
                </button>
                {showLine && <div className="w-0.5 flex-1 bg-white/15 my-1.5 min-h-[22px]" />}
              </div>
              <div className="flex flex-col gap-[3px] pb-[26px]">
                <div className="text-[15px] font-bold" style={{ color: tFg }}>{s.title}</div>
                <div className="text-[13px] text-sub">{s.sub}</div>
              </div>
            </div>
          );
        })}
        <div className="flex-1" />
        <div className="flex items-center gap-2 mt-[18px] text-xs text-sub">
          <div className="bg-white/10 rounded-full px-[11px] py-1 flex items-center gap-1.5">
            {market === "IN" ? "🇮🇳 India" : "🌍 UK"}
          </div>
          <div className="flex items-center gap-[5px]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald" />Autosaved
          </div>
        </div>
      </aside>
      <main className="bg-sage overflow-y-auto">{children}</main>
    </div>
  );
}
