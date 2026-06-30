"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

type Intensity = "off" | "honest" | "aggressive";

const SEG_OPTS = [
  { v: "off" as Intensity, label: "Off", desc: "Send your resume exactly as uploaded." },
  { v: "honest" as Intensity, label: "Honest", desc: "Reorder and emphasize relevant experience." },
  { v: "aggressive" as Intensity, label: "Aggressive", desc: "Rewrite content to closely match the JD." },
];

const COVER_OPTS = [
  { v: "off" as Intensity, label: "Off", desc: "Don't generate a cover letter." },
  { v: "honest" as Intensity, label: "Honest", desc: "Tailor tone and emphasis to each job." },
  { v: "aggressive" as Intensity, label: "Aggressive", desc: "Rewrite to closely match the JD." },
];

function rules(pw: string) {
  return [
    { mark: pw.length >= 12, label: "12+ chars" },
    { mark: /[a-z]/.test(pw), label: "lowercase" },
    { mark: /[A-Z]/.test(pw), label: "uppercase" },
    { mark: /[0-9]/.test(pw), label: "number" },
    { mark: /[^A-Za-z0-9]/.test(pw), label: "special char" },
  ];
}

function genPassword() {
  const pools = ["abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "0123456789", "!@#$%^&*()-_=+"];
  let p = pools.map((s) => s[Math.floor(Math.random() * s.length)]).join("");
  const all = pools.join("");
  for (let i = 0; i < 12; i++) p += all[Math.floor(Math.random() * all.length)];
  return p.split("").sort(() => Math.random() - 0.5).join("");
}

export default function SetupStep() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [resumeOpt, setResumeOpt] = useState<Intensity>("honest");
  const [coverOpt, setCoverOpt] = useState<Intensity>("honest");
  const [autoR, setAutoR] = useState(true);
  const [autoC, setAutoC] = useState(false);
  const [recruiterOn, setRecruiterOn] = useState(false);
  const [recruiterMsg, setRecruiterMsg] = useState("");
  const [roles, setRoles] = useState<string[]>(["Data Analyst", "BI Analyst", "Data Scientist"]);
  const [roleInput, setRoleInput] = useState("");
  const [err, setErr] = useState(false);
  const [saving, setSaving] = useState(false);

  async function finish() {
    if (!rules(pw).every((r) => r.mark)) { setErr(true); return; }
    setSaving(true);
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    await supabase.from("profiles").update({
      app_password_encrypted: pw,
      resume_opt: resumeOpt,
      cover_letter_opt: coverOpt,
      auto_approve_resume: autoR,
      auto_approve_cover: autoC,
      recruiter_enabled: recruiterOn,
      recruiter_message: recruiterMsg || null,
      preferred_roles: roles,
    }).eq("id", user.id);
    setSaving(false);
    router.push("/app/dashboard");
  }

  function addRole(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && roleInput.trim()) {
      e.preventDefault();
      setRoles((rs) => [...rs, roleInput.trim()]);
      setRoleInput("");
    }
  }

  return (
    <div className="flex flex-col gap-7 px-16 pt-14 pb-9 max-w-[680px]">
      <div className="flex flex-col gap-2">
        <div className="text-[13px] font-semibold text-emerald">Step 3 of 3</div>
        <div className="text-[30px] font-bold tracking-[-0.02em]">Application setup.</div>
        <div className="text-sm text-muted">How we apply on your behalf — you can change all of this in Settings.</div>
      </div>

      {/* Password */}
      <div className="bg-white border border-mint rounded-[14px] p-6 flex flex-col gap-3.5">
        <div className="flex flex-col gap-1.5">
          <div className="text-base font-bold">Set a password for sites that ask.</div>
          <div className="text-[13px] text-muted leading-[1.55]">Some applications (Workday, iCIMS, Oracle, Naukri) require you to create an account mid-flow. We use this to sign you up automatically.</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["Workday", "iCIMS", "Oracle", "Naukri"].map((p) => (
            <div key={p} className="bg-sage border border-mint rounded-full px-3 py-1 text-xs font-semibold">{p}</div>
          ))}
          <div className="rounded-full px-2 py-1 text-xs text-muted">+ more</div>
        </div>
        <div className="flex gap-2.5">
          <input
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Application password"
            className="flex-1 min-w-0 bg-white border border-mint rounded-[10px] px-3.5 py-[11px] text-sm text-forest outline-none focus:border-emerald font-mono"
          />
          <button onClick={() => setPw(genPassword())} className="border border-mint rounded-[10px] px-4 py-[11px] text-[13px] font-semibold bg-white hover:bg-sage whitespace-nowrap">
            Generate strong password
          </button>
        </div>
        <div className="flex gap-3.5 flex-wrap">
          {rules(pw).map((r) => (
            <div key={r.label} className="text-xs flex items-center gap-1.5" style={{ color: r.mark ? "#10B981" : "#9CA3AF" }}>
              <span className="font-bold">{r.mark ? "✓" : "○"}</span> {r.label}
            </div>
          ))}
        </div>
        {err && <div className="text-xs text-red-500">Your password needs to meet all five rules before we can finish.</div>}
        <div className="text-xs text-muted">Encrypted before save. Your email is your username.</div>
      </div>

      {/* How should we apply */}
      <div className="bg-white border border-mint rounded-[14px] p-6 flex flex-col gap-[18px]">
        <div className="text-xs font-semibold tracking-[0.1em] uppercase text-muted">How should we apply?</div>
        <SegmentGroup label="Resume optimization" opts={SEG_OPTS} value={resumeOpt} onChange={setResumeOpt} />
        {resumeOpt === "aggressive" && (
          <div className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">We rephrase and reorder — we never invent experience.</div>
        )}
        <ToggleRow label="Auto-approve edits?" on={autoR} onToggle={() => setAutoR(!autoR)} />
        <div className="h-px bg-mint" />
        <SegmentGroup label="Cover letter optimization" opts={COVER_OPTS} value={coverOpt} onChange={setCoverOpt} />
        <ToggleRow label="Auto-approve edits?" on={autoC} onToggle={() => setAutoC(!autoC)} />
      </div>

      {/* Preferred roles */}
      <div className="bg-white border border-mint rounded-[14px] p-6 flex flex-col gap-3">
        <div className="text-sm font-semibold">Which roles do you want to target?</div>
        <div className="flex gap-2 flex-wrap items-center">
          {roles.map((r, i) => (
            <div key={r + i} className="bg-forest text-white rounded-full pl-3.5 pr-2 py-1.5 text-[13px] font-semibold flex items-center gap-2">
              {r}
              <button onClick={() => setRoles((rs) => rs.filter((_, j) => j !== i))} className="bg-white/15 rounded-full w-[17px] h-[17px] flex items-center justify-center text-[11px]">✕</button>
            </div>
          ))}
          <input
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            onKeyDown={addRole}
            placeholder="Type a role and press ↵"
            className="flex-1 min-w-[180px] bg-white border border-dashed border-mint rounded-full px-3.5 py-2 text-[13px] text-forest outline-none focus:border-emerald"
          />
        </div>
      </div>

      {/* Recruiter message */}
      <div className="bg-white border border-mint rounded-[14px] p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[3px]">
            <div className="text-sm font-semibold">Add a short message to recruiters where supported.</div>
            <div className="text-xs text-muted">Supported on LinkedIn, Indeed, and Naukri.</div>
          </div>
          <button onClick={() => setRecruiterOn(!recruiterOn)} style={{ background: recruiterOn ? "#10B981" : "#E5E7EB", justifyContent: recruiterOn ? "flex-end" : "flex-start" }} className="w-10 h-[23px] rounded-full p-[3px] flex flex-shrink-0">
            <div className="w-[17px] h-[17px] rounded-full bg-white shadow-sm" />
          </button>
        </div>
        {recruiterOn && (
          <textarea
            value={recruiterMsg}
            onChange={(e) => setRecruiterMsg(e.target.value)}
            rows={2}
            placeholder="Hi! I'm an experienced data analyst actively looking — happy to share more."
            className="w-full bg-white border border-mint rounded-[10px] px-3.5 py-[11px] text-sm text-forest outline-none focus:border-emerald resize-y"
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => router.push("/onboarding/about")} className="text-sm font-semibold text-muted hover:text-forest flex items-center gap-2">
          ← Back <span className="bg-white border border-mint rounded-[5px] px-[7px] py-[1px] text-xs">⇧ Tab</span>
        </button>
        <button onClick={finish} disabled={saving} className="bg-emerald text-white text-sm font-semibold px-6 py-3 rounded-[10px] flex items-center gap-2 hover:brightness-[0.93] disabled:opacity-50">
          {saving ? "Saving…" : <>Finish setup → <span className="bg-white/20 rounded-[5px] px-[7px] py-[1px] text-xs">↵</span></>}
        </button>
      </div>
    </div>
  );
}

function SegmentGroup({ label, opts, value, onChange }: { label: string; opts: { v: Intensity; label: string; desc: string }[]; value: Intensity; onChange: (v: Intensity) => void }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-sm font-semibold">{label}</div>
      <div className="grid grid-cols-3 gap-2">
        {opts.map((o) => {
          const sel = value === o.v;
          return (
            <button
              key={o.v}
              onClick={() => onChange(o.v)}
              style={{
                background: sel ? "#F0FAF4" : "#FFFFFF",
                borderColor: sel ? "#10B981" : "#D1FAE5",
              }}
              className="rounded-[10px] px-3.5 py-3 flex flex-col gap-1 border-2 text-left"
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
    <div className="flex items-center justify-between">
      <div className="text-[13px] text-muted">{label}</div>
      <button onClick={onToggle} style={{ background: on ? "#10B981" : "#E5E7EB", justifyContent: on ? "flex-end" : "flex-start" }} className="w-10 h-[23px] rounded-full p-[3px] flex">
        <div className="w-[17px] h-[17px] rounded-full bg-white shadow-sm" />
      </button>
    </div>
  );
}
