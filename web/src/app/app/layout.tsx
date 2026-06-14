"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import JobDetailModal from "@/components/JobDetailModal";
import WhatsappModal from "@/components/WhatsappModal";
import Toast from "@/components/Toast";

const NAV = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/browse", label: "Browse jobs" },
  { href: "/app/inbox", label: "Inbox" },
  { href: "/app/tracker", label: "Tracker" },
  { href: "/app/profile", label: "Profile" },
  { href: "/app/settings", label: "Settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const openWa = useApp((s) => s.openWhatsapp);
  const appliedCount = useApp((s) => s.appliedIds.length);

  return (
    <div className="grid grid-cols-[232px_1fr] h-screen overflow-hidden">
      <nav className="bg-forest text-[#E7F5EC] px-3.5 py-5 pb-4 flex flex-col gap-[3px] overflow-y-auto">
        <div className="flex items-baseline gap-1.5 px-2.5 pb-5">
          <div className="text-xl font-bold text-white tracking-[-0.01em]">obisa</div>
          <div className="w-1.5 h-1.5 rounded-[2px] bg-emerald" />
        </div>
        {NAV.map((n) => {
          const active = pathname === n.href || (n.href !== "/app/dashboard" && pathname?.startsWith(n.href));
          return (
            <Link
              key={n.href}
              href={n.href}
              style={{ background: active ? "#FFFFFF14" : "transparent", color: active ? "#FFFFFF" : "#BBD8C6" }}
              className="text-sm font-semibold px-2.5 py-2.5 rounded-lg flex items-center gap-2.5 hover:brightness-[1.08]"
            >
              <div className="w-3.5 h-3.5 rounded flex-shrink-0" style={{ background: active ? "#10B981" : "#FFFFFF22" }} />
              {n.label}
            </Link>
          );
        })}
        <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-sub px-2.5 pt-[18px] pb-1.5">Channels</div>
        {[
          { label: "WhatsApp", onClick: openWa },
          { label: "Email" },
          { label: "Chrome" },
          { label: "Claude (MCP)" },
        ].map((ch) => (
          <button
            key={ch.label}
            onClick={ch.onClick}
            className="text-[13px] px-2.5 py-[7px] rounded-lg text-rail flex items-center gap-2.5 hover:bg-white/10 text-left"
          >
            <div className="w-3 h-3 rounded-full bg-white/15 flex-shrink-0" />
            {ch.label}
          </button>
        ))}
        <div className="flex-1 min-h-[18px]" />
        <button className="text-[13px] px-2.5 py-[7px] text-rail rounded-lg text-left hover:bg-white/10">Help & support</button>
        <button className="text-[13px] px-2.5 py-[7px] text-rail rounded-lg text-left hover:bg-white/10 mb-2.5">Send feedback</button>
        <div className="bg-white/10 rounded-[10px] p-3 flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline">
            <div className="text-xs text-rail">Applications left</div>
            <div className="text-[11px] text-sub">Free plan</div>
          </div>
          <div className="text-sm font-bold text-white">{Math.max(0, 25 - appliedCount)} / 25 free</div>
          <div className="h-1 bg-white/15 rounded-full overflow-hidden">
            <div className="h-full bg-emerald rounded-full" style={{ width: `${Math.max(0, 100 - appliedCount * 4)}%` }} />
          </div>
          <div className="text-xs text-emerald font-semibold cursor-pointer">Upgrade or buy a pack →</div>
        </div>
        <div className="flex items-center gap-2.5 px-1.5 pt-3">
          <div className="w-[30px] h-[30px] rounded-full bg-emerald text-white text-xs font-bold flex items-center justify-center">AR</div>
          <div className="flex flex-col">
            <div className="text-[13px] font-semibold text-white">Alistair Rodrigues</div>
            <div className="text-[11px] text-sub">alistairar7@gmail.com</div>
          </div>
        </div>
      </nav>
      <main className="bg-sage overflow-y-auto relative">
        {children}
      </main>
      <JobDetailModal />
      <WhatsappModal />
      <Toast />
    </div>
  );
}
