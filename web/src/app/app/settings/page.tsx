"use client";
import { useState } from "react";

type Tab = "Apply Settings" | "Password" | "Billing" | "Referrals" | "Email" | "Account";
type Intensity = "off" | "honest" | "aggressive";

const TABS: Tab[] = ["Apply Settings", "Password", "Billing", "Referrals", "Email", "Account"];

const RESUME_OPTS = [
  { v: "off" as Intensity, label: "Off", desc: "Send your resume exactly as uploaded." },
  { v: "honest" as Intensity, label: "Honest", desc: "Reorder and emphasize relevant experience." },
  { v: "aggressive" as Intensity, label: "Aggressive", desc: "Rewrite content to closely match the JD." },
];
const COVER_OPTS = [
  { v: "off" as Intensity, label: "Off", desc: "Don't generate a cover letter." },
  { v: "honest" as Intensity, label: "Honest", desc: "Tailor tone and emphasis to each job." },
  { v: "aggressive" as Intensity, label: "Aggressive", desc: "Rewrite to closely match the JD." },
];

export default function Settings() {
  const [tab, setTab] = useState<Tab>("Apply Settings");
  const [resumeOpt, setResumeOpt] = useState<Intensity>("honest");
  const [coverOpt, setCoverOpt] = useState<Intensity>("honest");
  const [autoR, setAutoR] = useState(true);
  const [autoC, setAutoC] = useState(false);
  const [pw, setPw] = useState("••••••••••••");

  return (
    <div className="px-7 pt-6 pb-10 flex flex-col gap-4 min-h-full">
      <div className="flex gap-2 border-b border-mint pb-3">
        {TABS.map((t) => {
          const sel = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                fontWeight: sel ? 700 : 500,
                color: sel ? "#1A3C2E" : "#6B7280",
                borderBottomColor: sel ? "#10B981" : "transparent",
              }}
              className="text-sm px-3 py-2 border-b-[3px] -mb-[15px] hover:text-forest"
            >
              {t}
            </button>
          );
        })}
      </div>

      {tab === "Apply Settings" && (
        <div className="flex flex-col gap-5 max-w-[720px]">
          <SegmentGroup label="Resume optimization" opts={RESUME_OPTS} value={resumeOpt} onChange={setResumeOpt} />
          {resumeOpt === "aggressive" && (
            <div className="bg-amber-50 border border-amber-400 rounded-[10px] px-3.5 py-2.5 text-xs text-amber-700">We rephrase and reorder — we never invent experience.</div>
          )}
          <ToggleRow label="Auto-approve edits?" on={autoR} onToggle={() => setAutoR(!autoR)} />
          <div className="h-px bg-mint" />
          <SegmentGroup label="Cover letter optimization" opts={COVER_OPTS} value={coverOpt} onChange={setCoverOpt} />
          <ToggleRow label="Auto-approve edits?" on={autoC} onToggle={() => setAutoC(!autoC)} />
        </div>
      )}

      {tab === "Password" && (
        <div className="max-w-[520px] flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <div className="text-sm font-semibold">Workday password</div>
            <div className="text-[13px] text-muted leading-[1.55]">This password is used to auto-fill Workday, iCIMS, and similar ATS logins during the application flow.</div>
          </div>
          <input
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••••••••••"
            className="w-full bg-white border border-mint rounded-[10px] px-3.5 py-[11px] text-sm text-forest outline-none focus:border-emerald font-mono"
          />
          <div className="text-[13px] text-muted">Encrypted before save. Never shared with employers.</div>
        </div>
      )}

      {tab === "Billing" && (
        <div className="max-w-[520px] flex flex-col gap-3.5">
          <div className="bg-white border border-mint rounded-xl p-[18px] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Free plan</div>
              <div className="bg-emerald text-white text-[11px] font-bold px-2 py-0.5 rounded">ACTIVE</div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-mint">
              <div className="text-[13px] text-muted">Applications per month</div>
              <div className="text-sm font-semibold">25</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-[13px] text-muted">Price</div>
              <div className="text-sm font-semibold">Free forever</div>
            </div>
          </div>
          <div className="bg-white border border-mint rounded-xl p-[18px] flex flex-col gap-2.5">
            <div className="text-sm font-bold">Ready for more?</div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="border border-mint rounded-[10px] p-3 text-center">
                <div className="text-[13px] font-semibold">Buy 50 pack</div>
                <div className="text-sm font-bold text-emerald mt-1">₹999 / £29</div>
              </div>
              <div className="border border-mint rounded-[10px] p-3 text-center">
                <div className="text-[13px] font-semibold">Pro plan</div>
                <div className="text-sm font-bold text-emerald mt-1">₹4,999 / £149</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "Referrals" && (
        <div className="max-w-[520px]">
          <div className="bg-white border border-mint rounded-xl p-[18px] flex flex-col gap-2.5">
            <div className="text-sm font-bold">Your referral link</div>
            <div className="bg-gray-50 border border-mint rounded-[10px] px-3.5 py-[11px] font-mono text-xs text-gray-600 break-all">obisa.app/invite/alistair-rodrigues-7429</div>
            <div className="text-xs text-muted">Share this with friends — they get 50 free applications on signup. You both get 10 bonus applications when they apply.</div>
          </div>
        </div>
      )}

      {tab === "Email" && (
        <div className="max-w-[520px]">
          <div className="bg-white border border-mint rounded-xl p-[18px] flex flex-col gap-3">
            <div className="text-sm font-bold">Connected inboxes</div>
            <div className="flex items-center justify-between py-2.5 border-b border-mint">
              <div className="text-[13px]">alistairar7@gmail.com</div>
              <div className="bg-mint text-mint-deep text-[11px] font-bold px-2 py-0.5 rounded">CONNECTED</div>
            </div>
            <div className="text-xs text-muted">We forward OTP codes to this address. obisa never sends you email unless you set up an automation.</div>
          </div>
        </div>
      )}

      {tab === "Account" && (
        <div className="max-w-[520px] flex flex-col gap-3.5">
          <div className="bg-white border border-mint rounded-xl p-[18px] flex flex-col gap-3">
            <div className="text-sm font-bold">Account</div>
            <div className="flex justify-between items-center py-2.5"><div className="text-[13px]">Email</div><div className="text-[13px] text-gray-600 font-semibold">alistairar7@gmail.com</div></div>
            <div className="flex justify-between items-center py-2.5 border-t border-b border-mint"><div className="text-[13px]">Account type</div><div className="text-[13px] text-gray-600 font-semibold">Free</div></div>
            <div className="text-xs text-muted mt-1">Created 14 days ago. Not tracking identifiable information.</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex flex-col gap-2.5">
            <div className="text-[13px] font-semibold text-red-700">Delete account</div>
            <div className="text-xs text-red-700 leading-[1.5]">Permanently delete all your data, applications, and settings. This cannot be undone.</div>
            <button className="bg-white text-red-700 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-red-100">Delete my account</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SegmentGroup({ label, opts, value, onChange }: { label: string; opts: { v: Intensity; label: string; desc: string }[]; value: Intensity; onChange: (v: Intensity) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-base font-bold">{label}</div>
      <div className="grid grid-cols-3 gap-2.5">
        {opts.map((o) => {
          const sel = value === o.v;
          return (
            <button
              key={o.v}
              onClick={() => onChange(o.v)}
              style={{ background: sel ? "#F0FAF4" : "#FFFFFF", borderColor: sel ? "#10B981" : "#D1FAE5" }}
              className="rounded-xl p-3.5 flex flex-col gap-1.5 border-2 text-left"
            >
              <div className="text-sm font-bold" style={{ color: sel ? "#1A3C2E" : "#6B7280" }}>{o.label}</div>
              <div className="text-xs leading-[1.45]" style={{ color: sel ? "#4B5563" : "#9CA3AF" }}>{o.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ToggleRow({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between mt-1.5">
      <div className="text-[13px] text-muted">{label}</div>
      <button onClick={onToggle} style={{ background: on ? "#10B981" : "#E5E7EB", justifyContent: on ? "flex-end" : "flex-start" }} className="w-10 h-[23px] rounded-full p-[3px] flex">
        <div className="w-[17px] h-[17px] rounded-full bg-white shadow-sm" />
      </button>
    </div>
  );
}
