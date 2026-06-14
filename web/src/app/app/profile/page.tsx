"use client";
import { useState } from "react";

export default function Profile() {
  const [bio, setBio] = useState("Data analyst with 4 years across fintech and SaaS. SQL, Python, and a soft spot for dashboards that get used.");

  return (
    <div className="px-7 pt-6 pb-10 flex flex-col gap-5 min-h-full">
      {/* Summary */}
      <div className="bg-white border border-mint rounded-[14px] p-5 flex items-start gap-[18px]">
        <div className="w-12 h-12 rounded-full bg-emerald text-white text-base font-bold flex items-center justify-center flex-shrink-0">AR</div>
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-baseline gap-3">
            <div className="text-[22px] font-bold">Alistair Rodrigues</div>
            <button className="bg-sage border border-mint rounded-md px-2.5 py-1 text-xs font-medium text-muted">Default profile ▾</button>
          </div>
          <input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Add a 1–2 line summary about yourself…"
            className="bg-transparent border-none text-sm text-gray-600 outline-none p-0 focus:outline-1 focus:outline-emerald focus:p-0.5 focus:rounded"
          />
          <div className="text-sm text-muted">📍 Pimpri-Chinchwad, Maharashtra, India</div>
          <div className="flex gap-3.5 text-[13px] text-muted">
            <div>alistairar7@gmail.com</div>
            <div>+91 98765 43210</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0 items-end">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold bg-mint text-mint-deep px-[11px] py-1.5 rounded-full">
            <div className="w-[7px] h-[7px] rounded-full bg-emerald" />80% Complete
          </div>
          <button className="bg-white border border-mint rounded-lg px-3 py-1.5 text-xs font-semibold text-muted hover:text-forest">Edit</button>
        </div>
      </div>

      {/* Resume */}
      <Section title="Resume" headerExtras={<RedTag>PDF</RedTag>} actions={["Preview", "Upload", "Download"]}>
        <div className="text-[13px] text-muted">What we submit on every application.</div>
      </Section>

      {/* Experience */}
      <Section title="Experience · 3 roles" actions={["Edit"]}>
        <div className="flex flex-col gap-3.5">
          <Role title="Senior Data Analyst" company="Meridian Labs" dates="Jan 2022 – Jan 2024 · 2 yrs" bullets="• Owned reporting for the payments vertical with SQL and Python • Built the company's primary Tableau dashboard suite • Presented insights to leadership weekly" more="+ 2 more bullets" />
          <Role title="Data Analyst" company="Suryadeep Finance" dates="Jun 2020 – Dec 2021 · 1 yr 7 mos" bullets="• Defined metrics for collections and risk dashboards • Owned the monthly regulatory reporting cycle" />
        </div>
        <div className="bg-gray-50 border border-dashed border-mint rounded-[10px] py-3.5 text-center text-emerald text-[13px] font-semibold cursor-pointer">+ Add role</div>
      </Section>

      {/* Skills */}
      <Section title="Skills · 8 across 2 categories" actions={["Edit"]}>
        <div className="flex flex-col gap-3.5">
          <SkillGroup name="Data & SQL" items={["Python", "SQL", "R", "Pandas"]} />
          <SkillGroup name="Visualization & BI" items={["Tableau", "Looker", "Power BI", "matplotlib"]} />
        </div>
      </Section>

      {/* Application defaults */}
      <Section title="Application defaults" actions={["Edit"]}>
        <div className="text-xs text-muted leading-[1.6]">What we auto-fill on every ATS form.</div>
        <div className="grid grid-cols-2 gap-3.5 text-[13px]">
          {[
            ["Work authorization", "Authorized to work"],
            ["Notice period", "30 days"],
            ["Current CTC", "₹16 LPA"],
            ["Expected CTC", "₹18–24 LPA"],
            ["Can relocate", "No"],
            ["In-person", "Yes"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1">
              <div className="font-semibold text-muted">{k}</div>
              <div className="text-gray-600">{v}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children, actions = [], headerExtras }: { title: string; children: React.ReactNode; actions?: string[]; headerExtras?: React.ReactNode }) {
  return (
    <div className="bg-white border border-mint rounded-[14px] p-5 flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-base font-bold">{title}</div>
          {headerExtras}
        </div>
        <div className="flex gap-2 text-[13px] font-semibold">
          {actions.map((a) => <button key={a} className="text-emerald cursor-pointer">{a}</button>)}
        </div>
      </div>
      {children}
    </div>
  );
}

function RedTag({ children }: { children: React.ReactNode }) {
  return <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">{children}</div>;
}

function Role({ title, company, dates, bullets, more }: { title: string; company: string; dates: string; bullets: string; more?: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-[10px] bg-sage border border-mint flex-shrink-0" />
      <div className="flex-1 min-w-0 flex flex-col gap-[3px]">
        <div className="text-sm font-bold">{title}</div>
        <div className="text-[13px] text-muted">{company}</div>
        <div className="text-xs text-gray-400">{dates}</div>
        <div className="text-[13px] text-gray-600 mt-1.5 leading-[1.5]">{bullets}</div>
        {more && <div className="text-xs text-emerald cursor-pointer mt-1">{more}</div>}
      </div>
    </div>
  );
}

function SkillGroup({ name, items }: { name: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold text-muted">{name}</div>
      <div className="flex gap-2 flex-wrap">
        {items.map((s) => <div key={s} className="bg-sage border border-mint rounded-full px-3 py-1 text-[13px] text-forest">{s}</div>)}
      </div>
    </div>
  );
}
