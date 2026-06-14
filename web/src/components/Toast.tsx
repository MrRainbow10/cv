"use client";
import { useApp } from "@/lib/store";

export default function Toast() {
  const toast = useApp((s) => s.toast);
  if (!toast) return null;
  return (
    <div className="fixed bottom-[26px] left-1/2 -translate-x-1/2 bg-forest text-white text-sm font-medium px-[22px] py-3 rounded-full shadow-[0_6px_24px_rgba(26,60,46,0.35)] z-[200] flex items-center gap-2.5">
      <div className="w-[7px] h-[7px] rounded-full bg-emerald" />
      {toast}
    </div>
  );
}
