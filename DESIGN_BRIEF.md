# Design Brief — Sign-in / Onboarding & Dashboard

> **For:** AI design tool (page generation).
> **Product:** AI job application automation platform — **India & UK markets**.
> **Scope of this brief:** the **sign-in/onboarding flow** and the **dashboard**.
> **Reference product (US):** Tsenta. We are adapting it for India and UK.
> **Last updated:** 2026-06-12

---

## 0. Global rules for the designer

- **Market toggle drives everything.** At the very top of sign-in, the user picks **🇮🇳 India** or
  **🌍 Abroad (UK)**. This choice changes field labels, eligibility questions, currency, and job
  portals across the whole flow. Design both states for every screen that differs.
- **Tone:** clean, fast, reassuring. Microcopy should explain *why* we ask each thing ("Every
  application asks these. Answer once here, we fill the forms.").
- **Onboarding is now 3 steps** (merged down from 6). Show a "Step X of 3" progress indicator.
- **Background parsing:** while the user fills steps, show a small "Resume — in progress / done"
  status chip ("Takes 30–60 seconds. We're pulling your work history and skills while you finish these.").
- **Autosave** every step; show an "Autosaved" indicator.
- Primary action button bottom-right, labelled per step; secondary "Back" bottom-left.

---

## 1. Entry — Market Toggle

A simple two-tab selector on the sign-in/landing screen:

```
┌─────────────────────────────────────────────┐
│   Where are you job hunting?                  │
│                                               │
│   [ 🇮🇳 India ]   [ 🌍 Abroad (UK) ]          │
│                                               │
│   You can change this later in Settings.      │
└─────────────────────────────────────────────┘
```

Selecting a tab sets `market = "IN"` or `market = "UK"` for the session.

---

## 2. Onboarding — 3 Steps

### STEP 1 of 3 — Resume

**Same for both markets.**

- Headline: "Upload your resume."
- Subcopy: "PDF only, under 10MB. We parse it, draft a cover letter, and have matches waiting by the
  time you finish setup."
- Dropzone: "Drop your PDF here, or browse" — caption "Resume · PDF only · up to 10MB"
- Field: **Referral code · optional** (e.g. JOHN1234)
- Button: **Continue** — caption "Takes about 30 seconds"
- On upload, background tasks start: parse profile, draft cover letter, queue job matches.

---

### STEP 2 of 3 — About you
*(Merges old Location + Contact + Work eligibility + Quick checklist.)*

Shown as **grouped sections on one scrollable step**, with the resume-parsing chip visible.

#### Section A — Location

| Field | 🇮🇳 India | 🌍 UK |
|-------|----------|-------|
| Address line | Start typing your address… | Start typing your address… |
| City | City | City / Town |
| Postal code | **PIN code** (6 digits) | **Postcode** (e.g. SW1A 1AA) |
| District / County | **District** (auto-filled) | County (auto-filled) |
| Region | **State / UT** (28 states + 8 UTs dropdown) | County / Region |
| Country | India (locked) | United Kingdom (locked) |

#### Section B — Contact

| Field | 🇮🇳 India | 🌍 UK |
|-------|----------|-------|
| Phone | default **+91** | default **+44** |
| Alternate phone (optional) | shown | hidden |
| LinkedIn URL | shown | shown |

Microcopy: "Phone and LinkedIn show up on most applications."

#### Section C — Work eligibility *(diverges by market)*

**🇮🇳 India:**
- **Notice period** (Immediate / 15 / 30 / 60 / 90 days)
- **Current CTC** — ₹ in LPA (lakhs per annum)
- **Expected CTC** — ₹ in LPA (allow a range)
- **Willing to relocate?** (Yes / No)
- *(Optional)* Are you an Indian citizen? (Yes / No)

**🌍 UK:**
- **Do you have the right to work in the UK?** (Yes / No)
- **Will you now or in future require visa sponsorship?** (Yes / No)
- **Notice period** (Immediate / 1 week / 2 weeks / 1 month / 3 months)

#### Section D — Quick checklist

**Preferences (same both markets):**
- Open to in-person work? · Willing to relocate? · Can start immediately? · Reliable transportation?
  · Need workplace accommodations? (disability, religious, or other)

**Diversity & Inclusion (optional, both markets):**

| Field | 🇮🇳 India | 🌍 UK |
|-------|----------|-------|
| Gender | shown | shown |
| Category / Ethnicity | **Category** (General / OBC / SC / ST) *(optional, govt/PSU roles)* | **Ethnicity** (UK census categories) |
| Disability status | **shown (PwD)** | **shown** |
| Sexual orientation | hidden | shown (voluntary) |

**Additional info (optional, both):** free-text — e.g. "Notice period 15 days", "Willing to travel up to 50%".

Button: **Continue**

---

### STEP 3 of 3 — Application setup
*(Merges old Password + Application settings.)*

#### Section A — Application password
- Headline: "Set a password for sites that ask."
- Subcopy: "Some applications (Workday, iCIMS, Oracle, Naukri) require you to create an account
  mid-flow. We use this to sign you up automatically."
- Logos row: Workday · iCIMS · Oracle · Naukri · + more
- Field: password with **Generate strong password** button.
- Rules checklist (live): 12+ chars · lowercase · uppercase · number · special char.
- Caption: "Encrypted before save." **Username = your email** (no separate username field).

#### Section B — How should we apply?

**Resume optimization** (segmented control):
- **Off** — Send your resume exactly as uploaded.
- **Honest** — Reorder and emphasize experience that's relevant to each job.
- **Aggressive** — Rewrite content to match the job description closely.
- Toggle: **Auto-approve edits?** (skip preview, send straight through)

**Cover letter optimization** (segmented control):
- **Off** — Don't generate a cover letter.
- **Honest** — Tailor tone and emphasis to each job, no fabrication.
- **Aggressive** — Rewrite the cover letter to closely match the job description.
- Toggle: **Auto-approve edits?**

> Design note: under "Aggressive", show a subtle helper line: "We rephrase and reorder — we never
> invent experience."

#### Section C — Preferred roles (NEW)
- Multi-tag input: "Which roles do you want to target?" e.g. *Data Analyst, BI Analyst, Data Scientist*.
- Used to improve match quality immediately.

#### Section D — Recruiter message (NEW, optional)
- Toggle + short text field: "Add a short message to recruiters where supported."
- Helper: "Supported on LinkedIn, Indeed, and Naukri. Sent only where the platform allows it."

Button: **Finish setup** → lands on Dashboard.

---

## 3. Dashboard

Adapted from the reference product. Market toggle in the top bar reflects current market.

### 3.1 Left navigation rail
- **Primary:** Dashboard · Browse jobs · Inbox · Tracker · Profile · Settings
- **Channels:** WhatsApp · Email · Chrome · Claude (MCP)  *(replaces iMessage)*
- **Footer:** Help & support · Send feedback
- **Plan widget:** "Applications left: 25 / 25 free · Free plan · Upgrade or buy a pack"
- **User chip:** avatar + name at bottom.

### 3.2 Top bar
- Search "Search by title, company…"
- Market indicator (🇮🇳 India / 🌍 UK), switchable.
- Filter row (see 3.3).

### 3.3 Filters
Common: Date · Location · Workplace (Remote / Hybrid / Onsite) · Degree level · Max experience ·
Role · Job type · Employment type · More.

| Filter | 🇮🇳 India | 🌍 UK |
|--------|----------|-------|
| Sponsors visa | hidden | **shown** |
| CTC / salary range | **CTC range (₹ LPA)** | Salary range (£) |
| Experience band | Fresher / Experienced toggle | Experience level |

### 3.4 Job match feed
- Heading: "Top job matches" with bulk button "Apply to all N".
- **Job card** shows:
  - Location · posting age (e.g. "2 days ago")
  - **Match %** badge (e.g. 74% match)
  - Job title
  - Top skills as chips (e.g. sql, python, +12)
  - Company name + logo
  - Actions: **Pass** · **Apply**
- "Add your own" + "Browse jobs" entry points.

#### Currency & salary display (IMPORTANT — internal listing logic)
- Show salary in the job's **native currency**, not just the market currency:
  - India job → **₹ INR** (LPA)
  - UK job → **£ GBP**
  - **US-based remote role paying in dollars → $ USD** (label it "Remote · paid in USD")
- If the job description has **no salary**, show **"Salary not disclosed"** (do not invent or convert).
- Optional: show an approximate converted value as secondary text (e.g. "$120k ≈ ₹1.0 Cr/yr") clearly
  marked as an estimate.

### 3.5 Job detail view
- Clicking a card opens the **full job description (JD)**.
- Show: title, company, location, workplace type, salary (per currency rules above), posting date,
  skills, full JD body, and **Apply / Pass** actions.

### 3.6 Application tracker
- Tabs/counters: **All · Submitted · In flight · Needs you · Failed · Skipped**.
- "Approve all" bulk action. Search by company.
- Each row: company, role, status, date, action.

---

## 4. Messaging channel screens

### WhatsApp (primary)
- Modal: "Apply over WhatsApp — Same flow as iMessage, on WhatsApp."
  - "Daily matches delivered to your chat"
  - "Reply yes to apply"
  - "Works on any device with WhatsApp installed"
  - Contact number + **Open WhatsApp** button.

### Email
- Equivalent screen: "Get daily matches by email. Reply to apply." Provider/setup TBD.

---

## 5. Screens to generate (checklist for the design tool)

1. Landing / sign-in with **market toggle**
2. Onboarding **Step 1** — Resume (India & UK identical)
3. Onboarding **Step 2** — About you (India variant + UK variant)
4. Onboarding **Step 3** — Application setup (India & UK, minor differences)
5. **Dashboard** — match feed (India variant + UK variant)
6. **Job detail** view (with currency states: INR / GBP / USD / not disclosed)
7. **Tracker** view
8. **WhatsApp** connect modal
9. (Stretch) Inbox, Profile, Settings

---

## 6. Notes carried from product decisions

- **No fabrication** in Aggressive mode — rephrase/reorder/emphasize only.
- **Email = username** for ATS account creation; no separate username field.
- **Notice period** asked in both markets.
- **Disability** field present in both markets.
- **Recruiter messaging** enabled for LinkedIn, Indeed, Naukri (compliance reviewed per platform later).
- Job portals (back-end, not a design screen yet): India → Naukri, LinkedIn, Indeed; UK → LinkedIn,
  Indeed, Reed, Totaljobs, Adzuna.
