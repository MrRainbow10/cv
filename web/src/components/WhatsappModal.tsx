"use client";
import { useApp } from "@/lib/store";

export default function WhatsappModal() {
  const open = useApp((s) => s.whatsappOpen);
  const close = useApp((s) => s.closeWhatsapp);
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/20 z-[100] flex items-center justify-center p-5">
      <div onClick={close} className="absolute inset-0" />
      <div className="relative bg-white border border-mint rounded-[18px] p-8 max-w-[420px] flex flex-col gap-5 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">Apply over WhatsApp</div>
          <button onClick={close} className="text-[22px] text-gray-400 hover:text-forest">✕</button>
        </div>
        <div className="flex flex-col gap-3">
          {[
            ["📱", "Daily matches delivered to your chat"],
            ["✅", "Reply yes to apply — we handle the rest"],
            ["📲", "Works on any device with WhatsApp installed"],
          ].map(([icon, txt]) => (
            <div key={txt} className="flex gap-2.5 items-start">
              <div className="flex-shrink-0 mt-[3px]">{icon}</div>
              <div className="text-sm text-gray-600 leading-relaxed">{txt}</div>
            </div>
          ))}
        </div>
        <div className="bg-sage border border-mint rounded-xl p-3.5 text-center">
          <div className="text-xs text-muted mb-1.5">Contact number</div>
          <div className="text-[15px] font-bold font-mono">+91 XXXXX 88888</div>
        </div>
        <div className="flex gap-2.5">
          <button onClick={close} className="flex-1 border border-mint text-forest text-sm font-semibold px-[18px] py-3 rounded-[10px] hover:bg-sage">Close</button>
          <button className="flex-1 bg-emerald text-white text-sm font-semibold px-[18px] py-3 rounded-[10px] hover:brightness-[0.93]">Open WhatsApp</button>
        </div>
      </div>
    </div>
  );
}
