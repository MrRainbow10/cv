"use client";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

export default function Landing() {
  const router = useRouter();
  const setMarket = useApp((s) => s.setMarket);

  function pick(m: "IN" | "UK") {
    setMarket(m);
    router.push("/onboarding/resume");
  }

  return (
    <main className="min-h-screen bg-sage text-forest flex flex-col items-center justify-center px-8 gap-7">
      <div className="flex items-baseline gap-[7px]">
        <div className="text-2xl font-bold tracking-[-0.02em]">obisa</div>
        <div className="w-[7px] h-[7px] rounded-[2px] bg-emerald" />
      </div>

      <div className="w-full max-w-[560px] bg-white border border-mint rounded-2xl p-10 shadow-[0_2px_12px_rgba(26,60,46,0.06)] flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-[28px] font-bold tracking-[-0.02em]">Where are you job hunting?</div>
          <div className="text-sm text-muted">We tailor everything — forms, salaries, visa questions — to your market.</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { m: "IN" as const, flag: "🇮🇳", label: "India", sub: "₹ LPA · Naukri · CTC" },
            { m: "UK" as const, flag: "🌍", label: "Abroad (UK)", sub: "£ GBP · visa sponsorship" },
          ].map((o) => (
            <button
              key={o.m}
              onClick={() => pick(o.m)}
              className="border-2 border-mint rounded-[14px] py-[26px] px-[18px] flex flex-col items-center gap-2.5 bg-white hover:border-emerald hover:bg-sage transition-colors"
            >
              <div className="text-[32px] leading-none">{o.flag}</div>
              <div className="text-[17px] font-bold">{o.label}</div>
              <div className="text-xs text-muted">{o.sub}</div>
            </button>
          ))}
        </div>
        <div className="text-[13px] text-muted text-center">You can change this later in Settings.</div>
      </div>

      <button
        onClick={() => { setMarket("IN"); router.push("/app/dashboard"); }}
        className="text-[13px] text-muted underline underline-offset-[3px] hover:text-forest"
      >
        Skip setup — view the app with sample data →
      </button>
    </main>
  );
}
