"use client";
import type { Job, Market } from "@/lib/types";
import { logoStyle, salaryDisplay } from "@/lib/jobs";
import { useApp } from "@/lib/store";

export default function JobCard({ job, market }: { job: Job; market: Market }) {
  const apply = useApp((s) => s.apply);
  const pass = useApp((s) => s.pass);
  const openDetail = useApp((s) => s.openDetail);
  const logo = logoStyle(job.dark);
  const sal = salaryDisplay(job, market);

  return (
    <div className="bg-white border border-mint rounded-[14px] px-[22px] py-5 shadow-[0_1px_3px_rgba(26,60,46,0.05)] flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-[13px] text-muted">{job.loc} · {job.mode} · {job.age}</div>
        <div className="bg-emerald text-white text-xs font-semibold px-[11px] py-1 rounded-full">{job.match}% match</div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="text-lg font-bold tracking-[-0.01em]">{job.title}</div>
        <div className="text-sm font-semibold" style={{ color: sal.color }}>
          {sal.text}{" "}
          {sal.est && <span className="font-normal text-muted text-xs">{sal.est}</span>}
          {sal.sponsorNote && <span className="font-semibold text-emerald text-xs ml-1">{sal.sponsorNote}</span>}
        </div>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {job.chips.slice(0, 4).map((c) => (
          <div key={c} className="bg-sage border border-mint text-forest text-xs px-2.5 py-[3px] rounded-full">{c}</div>
        ))}
        <div className="text-muted text-xs py-[3px] px-0.5">+ {job.more} more</div>
      </div>
      <div className="h-px bg-mint" />
      <div className="flex items-center justify-between gap-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center flex-shrink-0 border" style={{ background: logo.bg, color: logo.fg, borderColor: logo.bd }}>{job.logo}</div>
          <div className="flex flex-col min-w-0">
            <div className="text-[13px] font-semibold">{job.co}</div>
            <div className="text-[11px] text-muted font-mono truncate">{job.src}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => openDetail(job.id)} className="text-[13px] font-medium text-muted px-1.5 py-2 hover:text-forest">View details</button>
          <button onClick={() => pass(job.id)} className="border border-mint text-forest text-[13px] font-semibold px-[15px] py-2 rounded-[9px] hover:bg-sage">Pass</button>
          <button onClick={() => apply(job.id, job.title, job.co)} className="bg-emerald text-white text-[13px] font-semibold px-[19px] py-2 rounded-[9px] hover:brightness-[0.93]">Apply</button>
        </div>
      </div>
    </div>
  );
}
