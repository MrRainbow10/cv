"use client";
import { useApp } from "@/lib/store";
import { jobById, logoStyle, salaryDisplay } from "@/lib/jobs";

export default function JobDetailModal() {
  const id = useApp((s) => s.detailJobId);
  const close = useApp((s) => s.closeDetail);
  const apply = useApp((s) => s.apply);
  const pass = useApp((s) => s.pass);
  const market = useApp((s) => s.market);
  const cachedJob = useApp((s) => id ? s.jobCache[id] : undefined);
  const job = cachedJob || jobById(id);
  if (!job) return null;

  const logo = logoStyle(job.dark);
  const sal = salaryDisplay(job, market);

  return (
    <div className="fixed inset-0 bg-black/20 z-[100] flex items-end">
      <div onClick={close} className="absolute inset-0" />
      <div className="relative bg-white border-t border-mint rounded-t-[20px] w-full max-h-[80vh] overflow-y-auto flex flex-col">
        <div className="p-6 border-b border-mint flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-[10px] text-[13px] font-semibold flex items-center justify-center flex-shrink-0 border" style={{ background: logo.bg, color: logo.fg, borderColor: logo.bd }}>{job.logo}</div>
            <div className="flex flex-col min-w-0">
              <div className="text-[15px] font-bold">{job.co}</div>
              <div className="text-xs text-muted truncate">{job.src}</div>
            </div>
          </div>
          <button onClick={close} className="text-2xl text-gray-400 hover:text-forest w-8 h-8 flex items-center justify-center">✕</button>
        </div>
        <div className="p-7 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-3">
              <div className="text-[28px] font-bold tracking-[-0.02em]">{job.title}</div>
              <div className="bg-emerald text-white text-[11px] font-semibold px-2.5 py-[3px] rounded-full">{job.match}% match</div>
            </div>
            <div className="flex gap-[18px] flex-wrap text-sm text-muted">
              <div className="flex items-center gap-1">📍 {job.loc}</div>
              <div className="flex items-center gap-1">🏢 {job.mode}</div>
              <div className="flex items-center gap-1">🕐 {job.age}</div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="text-[15px] font-bold" style={{ color: sal.color }}>{sal.text}</div>
            {sal.est && <div className="text-[13px] text-muted">{sal.est}</div>}
            {sal.sponsorNote && <div className="text-[13px] font-semibold text-emerald">{sal.sponsorNote}</div>}
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-muted uppercase tracking-[0.08em]">Skills</div>
            <div className="flex gap-2 flex-wrap">
              {job.chips.map((c) => <div key={c} className="bg-sage border border-mint rounded-full px-3 py-1 text-xs text-forest">{c}</div>)}
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="text-xs font-semibold text-muted uppercase tracking-[0.08em]">About this role</div>
            <div className="text-sm leading-[1.65] text-gray-600">{job.about}</div>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="text-xs font-semibold text-muted uppercase tracking-[0.08em]">What we&apos;re looking for</div>
            <div className="flex flex-col gap-2">
              {job.reqs.map((r, i) => (
                <div key={i} className="text-sm leading-[1.5] text-gray-600 flex gap-2.5"><span className="flex-shrink-0">•</span><span>{r}</span></div>
              ))}
            </div>
          </div>
          <div className="flex gap-2.5 sticky bottom-0 pt-[18px] border-t border-mint bg-white">
            <button onClick={() => { pass(job.id); close(); }} className="flex-1 border border-mint text-forest text-sm font-semibold px-[18px] py-3 rounded-[10px] hover:bg-sage">Pass</button>
            <button onClick={() => { apply(job.id, job.title, job.co); close(); }} className="flex-1 bg-emerald text-white text-sm font-semibold px-[18px] py-3 rounded-[10px] hover:brightness-[0.93]">Apply now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
