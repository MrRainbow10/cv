"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { supabaseBrowser } from "@/lib/supabase";

const INDIA_STATES = ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Telangana", "Gujarat", "West Bengal", "Kerala", "Other"];
const UK_REGIONS = ["Greater London", "South East", "North West", "Scotland", "Wales", "Northern Ireland", "Other"];

const NOTICE_IN = ["Immediate", "15 days", "30 days", "60 days", "90 days"];
const NOTICE_UK = ["Immediate", "1 week", "2 weeks", "1 month", "3 months"];

const PREFS = [
  { key: "inperson", label: "Open to in-person work?" },
  { key: "relocate", label: "Willing to relocate?" },
  { key: "immediate", label: "Can start immediately?" },
  { key: "transport", label: "Reliable transportation?" },
  { key: "accommodations", label: "Need workplace accommodations?" },
] as const;

export default function AboutStep() {
  const router = useRouter();
  const market = useApp((s) => s.market);
  const isIndia = market === "IN";

  const [f, setF] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [yn, setYn] = useState<Record<string, boolean | null>>({ relocate: null, rtw: null, sponsor: null });
  const [prefs, setPrefs] = useState<Record<string, boolean>>({ inperson: true, relocate: false, immediate: true, transport: true, accommodations: false });
  const [saving, setSaving] = useState(false);
  const upd = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  async function onContinue() {
    setSaving(true);
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const num = (v: string) => (v ? Number(v) : null);
    const payload: Record<string, unknown> = {
      address_line: f.addrLine || null,
      city: f.city || null,
      postal_code: f.postal || null,
      district: f.district || null,
      region: f.region || null,
      phone: f.phone ? `${phonePrefix} ${f.phone}` : null,
      alt_phone: f.altPhone || null,
      linkedin_url: f.linkedin || null,
      notice_period: notice || null,
      open_to_in_person: prefs.inperson,
      willing_to_relocate: isIndia ? (yn.relocate ?? prefs.relocate) : prefs.relocate,
      can_start_immediately: prefs.immediate,
      reliable_transport: prefs.transport,
      needs_accommodations: prefs.accommodations,
      gender: f.gender || null,
      disability: f.disability || null,
      additional_info: f.additional || null,
    };
    if (isIndia) {
      payload.is_indian_citizen = yn.citizen ?? null;
      payload.current_ctc = num(f.currentCtc);
      payload.expected_ctc_min = num(f.expectedMin);
      payload.expected_ctc_max = num(f.expectedMax);
      payload.category_india = f.category || null;
    } else {
      payload.right_to_work_uk = yn.rtw ?? null;
      payload.requires_sponsorship = yn.sponsor ?? null;
      payload.ethnicity_uk = f.ethnicity || null;
    }
    await supabase.from("profiles").update(payload).eq("id", user.id);
    setSaving(false);
    router.push("/onboarding/setup");
  }

  const cityLabel = isIndia ? "City" : "City / Town";
  const postalLabel = isIndia ? "PIN code" : "Postcode";
  const postalPlaceholder = isIndia ? "6 digits" : "e.g. SW1A 1AA";
  const districtLabel = isIndia ? "District" : "County";
  const regionLabel = isIndia ? "State / UT" : "County / Region";
  const regionOpts = isIndia ? INDIA_STATES : UK_REGIONS;
  const country = isIndia ? "India" : "United Kingdom";
  const phonePrefix = isIndia ? "+91" : "+44";
  const noticeOpts = isIndia ? NOTICE_IN : NOTICE_UK;

  const ynRows = isIndia
    ? [
        { key: "relocate", label: "Willing to relocate?", note: "" },
        { key: "citizen", label: "Are you an Indian citizen?", note: "· optional" },
      ]
    : [
        { key: "rtw", label: "Do you have the right to work in the UK?", note: "" },
        { key: "sponsor", label: "Will you require visa sponsorship now or in future?", note: "" },
      ];

  const diRows = isIndia
    ? [
        { name: "gender", label: "Gender", options: ["—", "Woman", "Man", "Non-binary", "Prefer not to say"] },
        { name: "category", label: "Category (govt/PSU roles)", options: ["—", "General", "OBC", "SC", "ST"] },
        { name: "disability", label: "Disability status", options: ["—", "No", "Yes — PwD", "Prefer not to say"] },
      ]
    : [
        { name: "gender", label: "Gender", options: ["—", "Woman", "Man", "Non-binary", "Prefer not to say"] },
        { name: "ethnicity", label: "Ethnicity", options: ["—", "Asian or Asian British", "Black or Black British", "Mixed", "White", "Other", "Prefer not to say"] },
        { name: "disability", label: "Disability status", options: ["—", "No", "Yes", "Prefer not to say"] },
      ];

  return (
    <div className="flex flex-col gap-7 px-16 pt-14 pb-9 max-w-[680px]">
      <div className="flex flex-col gap-2">
        <div className="text-[13px] font-semibold text-emerald">Step 2 of 3</div>
        <div className="text-[30px] font-bold tracking-[-0.02em]">About you.</div>
        <div className="text-sm text-muted">This fills the boring parts of every application for you.</div>
      </div>

      {/* Location */}
      <Section title="Location">
        <Field label="Address line">
          <Input value={f.addrLine || ""} onChange={upd("addrLine")} placeholder="Start typing your address…" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={cityLabel}>
            <Input value={f.city || ""} onChange={upd("city")} placeholder={cityLabel} />
          </Field>
          <Field label={postalLabel}>
            <Input value={f.postal || ""} onChange={upd("postal")} placeholder={postalPlaceholder} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={`${districtLabel} · auto-filled`}>
            <Input value={f.district || ""} onChange={upd("district")} placeholder={districtLabel} className="bg-gray-50" />
          </Field>
          <Field label={regionLabel}>
            <select value={f.region || ""} onChange={upd("region")} className="w-full bg-white border border-mint rounded-[10px] px-3 py-[11px] text-sm text-forest outline-none focus:border-emerald">
              <option value="">Select…</option>
              {regionOpts.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Country · locked to your market">
          <div className="bg-gray-50 border border-mint rounded-[10px] px-3.5 py-[11px] text-sm text-muted flex justify-between items-center">
            {country} <span className="text-xs">🔒</span>
          </div>
        </Field>
      </Section>

      {/* Contact */}
      <Section title="Contact">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone">
            <div className="flex gap-2">
              <div className="bg-gray-50 border border-mint rounded-[10px] px-3 py-[11px] text-sm text-muted flex-shrink-0">{phonePrefix}</div>
              <Input value={f.phone || ""} onChange={upd("phone")} placeholder="98765 43210" className="flex-1 min-w-0" />
            </div>
          </Field>
          {isIndia && (
            <Field label="Alternate phone · optional">
              <Input value={f.altPhone || ""} onChange={upd("altPhone")} placeholder="+91" />
            </Field>
          )}
        </div>
        <Field label="LinkedIn URL">
          <Input value={f.linkedin || ""} onChange={upd("linkedin")} placeholder="linkedin.com/in/yourname" />
        </Field>
        <div className="text-xs text-muted">Phone and LinkedIn show up on most applications.</div>
      </Section>

      {/* Work eligibility */}
      <Section title="Work eligibility">
        {ynRows.map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-4">
            <div className="text-sm font-medium">{row.label} {row.note && <span className="font-normal text-muted text-xs">{row.note}</span>}</div>
            <div className="flex gap-1.5 flex-shrink-0">
              {["Yes", "No"].map((opt) => {
                const v = opt === "Yes";
                const sel = yn[row.key] === v;
                return (
                  <button
                    key={opt}
                    onClick={() => setYn((p) => ({ ...p, [row.key]: v }))}
                    style={{
                      background: sel ? "#1A3C2E" : "#FFFFFF",
                      color: sel ? "#FFFFFF" : "#1A3C2E",
                      borderColor: sel ? "#1A3C2E" : "#D1FAE5",
                    }}
                    className="text-[13px] font-semibold px-4 py-[7px] rounded-full border"
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Notice period</div>
          <div className="flex gap-1.5 flex-wrap">
            {noticeOpts.map((n) => {
              const sel = notice === n;
              return (
                <button
                  key={n}
                  onClick={() => setNotice(n)}
                  style={{
                    background: sel ? "#1A3C2E" : "#FFFFFF",
                    color: sel ? "#FFFFFF" : "#1A3C2E",
                    borderColor: sel ? "#1A3C2E" : "#D1FAE5",
                  }}
                  className="text-[13px] font-semibold px-3.5 py-[7px] rounded-full border"
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>
        {isIndia && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Current CTC · ₹ LPA">
              <Input value={f.currentCtc || ""} onChange={upd("currentCtc")} placeholder="e.g. 12" />
            </Field>
            <Field label="Expected CTC · ₹ LPA range">
              <div className="flex gap-2 items-center">
                <Input value={f.expectedMin || ""} onChange={upd("expectedMin")} placeholder="18" className="flex-1 min-w-0" />
                <div className="text-gray-400">–</div>
                <Input value={f.expectedMax || ""} onChange={upd("expectedMax")} placeholder="24" className="flex-1 min-w-0" />
              </div>
            </Field>
          </div>
        )}
      </Section>

      {/* Quick checklist */}
      <Section title="Quick checklist">
        <div className="flex flex-col gap-3">
          {PREFS.map((p) => (
            <div key={p.key} className="flex items-center justify-between gap-4">
              <div className="text-sm">{p.label}</div>
              <Toggle on={prefs[p.key]} onToggle={() => setPrefs((s) => ({ ...s, [p.key]: !s[p.key] }))} />
            </div>
          ))}
        </div>
        <div className="h-px bg-mint" />
        <div className="flex flex-col gap-3">
          <div className="text-[13px] font-semibold">Diversity & inclusion <span className="font-normal text-muted">· optional, never required</span></div>
          <div className="grid grid-cols-2 gap-3">
            {diRows.map((d) => (
              <Field key={d.name} label={d.label}>
                <select value={f[d.name] || ""} onChange={upd(d.name)} className="w-full bg-white border border-mint rounded-[10px] px-3 py-[11px] text-sm text-forest outline-none focus:border-emerald">
                  {d.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
            ))}
          </div>
        </div>
        <Field label="Additional info · optional">
          <textarea
            value={f.additional || ""}
            onChange={upd("additional")}
            rows={2}
            placeholder={`e.g. "Notice period 15 days", "Willing to travel 50%"`}
            className="w-full bg-white border border-mint rounded-[10px] px-3.5 py-[11px] text-sm text-forest outline-none focus:border-emerald resize-y"
          />
        </Field>
      </Section>

      <div className="flex items-center justify-between">
        <button onClick={() => router.push("/onboarding/resume")} className="text-sm font-semibold text-muted hover:text-forest flex items-center gap-2">
          ← Back <span className="bg-white border border-mint rounded-[5px] px-[7px] py-[1px] text-xs">⇧ Tab</span>
        </button>
        <button onClick={onContinue} disabled={saving} className="bg-emerald text-white text-sm font-semibold px-6 py-3 rounded-[10px] flex items-center gap-2 hover:brightness-[0.93] disabled:opacity-50">
          {saving ? "Saving…" : <>Continue · Step 2 of 3 <span className="bg-white/20 rounded-[5px] px-[7px] py-[1px] text-xs">↵</span></>}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-mint rounded-[14px] p-6 flex flex-col gap-4">
      <div className="text-xs font-semibold tracking-[0.1em] uppercase text-muted">{title}</div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-[13px] font-semibold">{label}</div>
      {children}
    </div>
  );
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-white border border-mint rounded-[10px] px-3.5 py-[11px] text-sm text-forest outline-none focus:border-emerald ${className}`}
    />
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{ background: on ? "#10B981" : "#E5E7EB", justifyContent: on ? "flex-end" : "flex-start" }}
      className="w-10 h-[23px] rounded-full p-[3px] flex"
    >
      <div className="w-[17px] h-[17px] rounded-full bg-white shadow-sm" />
    </button>
  );
}
