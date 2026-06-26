"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

type ProfileData = {
  email: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  region: string | null;
  market: string;
  bio: string | null;
  notice_period: string | null;
  current_ctc: number | null;
  expected_ctc_min: number | null;
  expected_ctc_max: number | null;
  willing_to_relocate: boolean | null;
  open_to_in_person: boolean | null;
  right_to_work_uk: boolean | null;
  requires_sponsorship: boolean | null;
  preferred_roles: string[];
  resume_opt: string | null;
  cover_letter_opt: string | null;
};

type ResumeRow = { id: string; filename: string | null; size_bytes: number | null; created_at: string };

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [resume, setResume] = useState<ResumeRow | null>(null);
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
        if (data) { setProfile(data as ProfileData); setBio(data.bio || ""); }
      });
      supabase.from("resumes").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).then(({ data }) => {
        if (data && data.length > 0) setResume(data[0] as ResumeRow);
      });
    });
  }, []);

  async function saveBio() {
    if (!profile) return;
    setSaving(true);
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from("profiles").update({ bio }).eq("id", user.id);
    setSaving(false);
  }

  if (!profile) {
    return (
      <div className="px-7 pt-6 pb-10 flex flex-col gap-5 min-h-full items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald border-t-transparent rounded-full animate-spin" />
        <div className="text-sm text-muted">Loading profile…</div>
      </div>
    );
  }

  const initials = (profile.full_name || profile.email || "??").slice(0, 2).toUpperCase();
  const displayName = profile.full_name || profile.email;
  const location = [profile.city, profile.region, profile.market === "IN" ? "India" : "United Kingdom"].filter(Boolean).join(", ");
  const isIndia = profile.market === "IN";

  const defaults: [string, string][] = [
    ["Work authorization", profile.right_to_work_uk ? "Authorized to work" : profile.market === "IN" ? "Indian citizen" : "Check settings"],
    ["Notice period", profile.notice_period || "Not set"],
    ...(isIndia ? [
      ["Current CTC", profile.current_ctc ? `₹${profile.current_ctc} LPA` : "Not set"] as [string, string],
      ["Expected CTC", profile.expected_ctc_min && profile.expected_ctc_max ? `₹${profile.expected_ctc_min}–${profile.expected_ctc_max} LPA` : "Not set"] as [string, string],
    ] : [
      ["Visa sponsorship", profile.requires_sponsorship ? "Required" : "Not required"] as [string, string],
    ]),
    ["Can relocate", profile.willing_to_relocate ? "Yes" : "No"],
    ["In-person", profile.open_to_in_person ? "Yes" : "No"],
  ];

  const completedFields = [profile.full_name, profile.phone, profile.city, profile.notice_period, bio, resume].filter(Boolean).length;
  const totalFields = 6;
  const completePct = Math.round((completedFields / totalFields) * 100);

  return (
    <div className="px-7 pt-6 pb-10 flex flex-col gap-5 min-h-full">
      <div className="bg-white border border-mint rounded-[14px] p-5 flex items-start gap-[18px]">
        <div className="w-12 h-12 rounded-full bg-emerald text-white text-base font-bold flex items-center justify-center flex-shrink-0">{initials}</div>
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-baseline gap-3">
            <div className="text-[22px] font-bold">{displayName}</div>
            <button className="bg-sage border border-mint rounded-md px-2.5 py-1 text-xs font-medium text-muted">Default profile ▾</button>
          </div>
          <div className="flex gap-2 items-center">
            <input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              onBlur={saveBio}
              placeholder="Add a 1–2 line summary about yourself…"
              className="flex-1 bg-transparent border-none text-sm text-gray-600 outline-none p-0 focus:outline-1 focus:outline-emerald focus:p-0.5 focus:rounded"
            />
            {saving && <span className="text-xs text-muted">Saving…</span>}
          </div>
          {location && <div className="text-sm text-muted">📍 {location}</div>}
          <div className="flex gap-3.5 text-[13px] text-muted">
            <div>{profile.email}</div>
            {profile.phone && <div>{profile.phone}</div>}
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0 items-end">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold bg-mint text-mint-deep px-[11px] py-1.5 rounded-full">
            <div className="w-[7px] h-[7px] rounded-full bg-emerald" />{completePct}% Complete
          </div>
        </div>
      </div>

      <Section title="Resume" headerExtras={resume ? <RedTag>PDF</RedTag> : undefined}>
        {resume ? (
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] rounded-[10px] bg-red-100 text-red-700 text-[11px] font-bold flex items-center justify-center">PDF</div>
            <div className="flex flex-col gap-0.5">
              <div className="text-sm font-semibold">{resume.filename || "resume.pdf"}</div>
              <div className="text-xs text-muted">{resume.size_bytes ? `${Math.round(resume.size_bytes / 1024)} KB` : ""} · Uploaded {new Date(resume.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        ) : (
          <div className="text-[13px] text-muted">No resume uploaded yet. <a href="/onboarding/resume" className="text-emerald font-semibold">Upload one →</a></div>
        )}
      </Section>

      {profile.preferred_roles && profile.preferred_roles.length > 0 && (
        <Section title={`Preferred roles · ${profile.preferred_roles.length}`}>
          <div className="flex gap-2 flex-wrap">
            {profile.preferred_roles.map((r) => (
              <div key={r} className="bg-forest text-white rounded-full px-3.5 py-1.5 text-[13px] font-semibold">{r}</div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Application defaults">
        <div className="text-xs text-muted leading-[1.6]">What we auto-fill on every ATS form.</div>
        <div className="grid grid-cols-2 gap-3.5 text-[13px]">
          {defaults.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1">
              <div className="font-semibold text-muted">{k}</div>
              <div className="text-gray-600">{v}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Application settings">
        <div className="grid grid-cols-2 gap-3.5 text-[13px]">
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-muted">Resume optimization</div>
            <div className="text-gray-600 capitalize">{profile.resume_opt || "honest"}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-muted">Cover letter</div>
            <div className="text-gray-600 capitalize">{profile.cover_letter_opt || "honest"}</div>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children, headerExtras }: { title: string; children: React.ReactNode; headerExtras?: React.ReactNode }) {
  return (
    <div className="bg-white border border-mint rounded-[14px] p-5 flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-base font-bold">{title}</div>
          {headerExtras}
        </div>
      </div>
      {children}
    </div>
  );
}

function RedTag({ children }: { children: React.ReactNode }) {
  return <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">{children}</div>;
}
