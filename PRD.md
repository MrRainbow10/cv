# Product Requirements Document (PRD)

## AI Job Application Automation Platform — India & UK Markets

> **Status:** 🟡 Draft — living document, built collaboratively step by step.
> **Last updated:** 2026-06-12
> **Reference product (US market):** [Tsenta](https://tsenta.com) (YC S26)
> **Guiding research:** Bommasani et al., *Algorithmic Monocultures in Hiring* (FAccT 2026) — see Appendix A.

---

## 0. How to read this document

This PRD is being assembled iteratively. Sections marked **[RESEARCH NEEDED]** have open
questions that require market/technical research before they are finalized. Sections marked
**[DECISION NEEDED]** require a product call from the founder. Nothing here is locked until
explicitly confirmed.

---

## 1. Product Vision

### 1.1 One-line description
An AI-powered job application assistant that parses a user's resume, tailors their CV and cover
letter per job (to a user-chosen intensity), surfaces matched job listings from major job portals,
and applies on their behalf — with delivery and approval flows over web, WhatsApp, and email.

### 1.2 What makes this different from Tsenta
| Dimension | Tsenta (US) | This product |
|-----------|-------------|--------------|
| Target market | United States | **India and the United Kingdom** |
| Primary portals | LinkedIn, Workday, Greenhouse, Lever, Ashby | **Naukri.com, LinkedIn, Indeed** (India) + **Reed, Totaljobs, CV-Library, Adzuna** (UK) [RESEARCH NEEDED] |
| Messaging channel | iMessage | **WhatsApp** (primary for India) + Email |
| Eligibility questions | US work authorization | **Market-specific** (notice period / CTC for India; right-to-work / sponsorship for UK) |
| Pricing | $20 / 600 applications | **[RESEARCH NEEDED]** — India price sensitivity, INR pricing |

### 1.3 Core promise
When a user finishes onboarding, the system should already be:
- Matching jobs from the relevant portals for their market
- Ready to tailor each CV/cover letter to the user's chosen intensity (Off / Honest / Aggressive)
- Delivering matches and accepting "apply" approvals over web, WhatsApp, or email

---

## 2. Onboarding Flow (6 Steps)

> Mirrors Tsenta's flow, adapted per market. Each step below notes what changes for India/UK.

### Step 1 — Resume Upload
- **Input:** PDF only, max 10 MB. Optional referral code.
- **System actions on upload:**
  - Parse resume → extract skills, roles, employment dates, education
  - Draft a first-pass cover letter from extracted experience
  - Begin queuing/matching jobs in the background
- **Target time:** under 60 seconds, parsing runs while user completes later steps.
- **Status:** ✅ Carry over as-is from reference.

### Step 2 — Location
- **Fields:** full address, city, ZIP/PIN, county/district (auto-filled), country, state.
- **India adaptation:** "ZIP" → **PIN code**; "County/District" → **District**; "State" → Indian states/UTs.
- **UK adaptation:** "ZIP" → **Postcode**; "State" → not used (use County/Region); "County" stays.
- **Rationale:** most job sites require a full address to auto-fill applications.
- **Status:** ✅ Carry over with localized field labels.

### Step 3 — Contact
- **Fields:** Phone (with country code, e.g. +91 India / +44 UK), LinkedIn URL.
- **Note:** fall back to resume-parsed values if skipped.
- **Status:** ✅ Carry over as-is.

### Step 4 — Work Eligibility **[RESEARCH NEEDED]**
- **US version (reference):** "Authorized to work in the US?" + "Require sponsorship now/future?"
- **India version (preliminary):**
  - Likely **remove** US authorization questions (most applicants are citizens).
  - **Add:** Notice period, Current CTC, Expected CTC, Willing to relocate.
  - *Open question:* how to handle non-citizen applicants in India (rare but exists).
- **UK version (preliminary):**
  - "Do you have the right to work in the UK?" (Yes/No)
  - "Will you now or in future require sponsorship?" (Yes/No)
  - These are legally standard on UK applications — keep close to US version.
- **Action:** research the exact eligibility questions standard to each market's application forms.

### Step 5 — Quick Checklist (Preferences + Background + D&I) **[RESEARCH NEEDED]**
- **Preferences:** in-person work, willing to relocate, can start immediately, reliable transport,
  workplace accommodations.
- **Background:** government clearance, family ties to foreign governments. → *US-centric, likely
  removed/replaced for India & UK.*
- **Diversity & Inclusion:** gender, race/ethnicity, veteran status, disability status.
  → *US EEOC framing. India & UK have different categories:*
  - **India:** category (General/OBC/SC/ST), gender, disability (PwD) — used for some govt/PSU roles.
  - **UK:** ethnicity, gender, disability, sexual orientation — voluntary equality monitoring.
- **Additional info:** free-text (e.g. "Notice period 15 days", "Willing to travel 50%").
- **Action:** research correct preference/background/D&I fields per market.

### Step 6a — Application Password **[DECISION NEEDED]**
- **Purpose:** some ATSes (Workday, iCIMS, Oracle, **Naukri**) require account creation mid-flow.
- **Fields:** auto-generated strong password (12+ chars, mixed case, number, special). Encrypted at rest.
- **Founder's idea — username field:** evaluate whether to let users pick a username.
  - **Recommendation (to confirm):** Most ATSes use **email as username**. A separate username field
    likely adds friction without benefit. Suggest: email + generated password only. *Verify per-ATS.*

### Step 6b — Application Settings (CORE STEP)
- **Resume optimization:** Off / Honest / Aggressive
  - *Off:* send exactly as uploaded
  - *Honest:* reorder & emphasize relevant experience (no fabrication)
  - *Aggressive:* rewrite content to closely match the JD — **HARD RULE: never fabricate experience,
    credentials, or dates.** (See §6 Ethical Boundaries.)
  - Auto-approve edits toggle (skip preview)
- **Cover letter optimization:** Off / Honest / Aggressive + auto-approve toggle
- **[PROPOSED ADDITION] Recruiter message:** optional short message to recruiter, where the platform
  permits it. **[RESEARCH NEEDED]** — LinkedIn forbids automated messaging (ban risk); Naukri allows
  some recruiter contact. Mark per-platform.
- **[PROPOSED ADDITION] Preferred roles:** let the user specify the role families they want to target
  (e.g. "Data Analyst, BI Analyst, Data Scientist"). Improves match quality from day one.

---

## 3. Dashboard

> Adapted from Tsenta's dashboard. Tabs may be added/removed per market.

### 3.1 Navigation (left rail)
- Dashboard, Browse jobs, Inbox, Tracker, Profile, Settings
- Channels: WhatsApp (primary), Email, Chrome extension, Claude (MCP) — *iMessage replaced by WhatsApp*
- Help & support, Send feedback
- Plan widget: applications remaining, current plan, upgrade/buy pack

### 3.2 Job match feed
- Filters: Date, Location, Workplace (remote/hybrid/onsite), Degree level, Max experience,
  **Sponsors visa** (UK-relevant), Role, Job type, Employment type, More.
  - **India adaptation [RESEARCH NEEDED]:** consider filters for **CTC range**, **notice period fit**,
    **fresher vs experienced**. "Sponsors visa" likely irrelevant for India.
- Each match card: location, posting age, **match % score**, title, top skills, company, Pass / Apply.
- Bulk action: "Apply to all N".

### 3.3 Job detail view
- On clicking a job, display the **full job description (JD)**.
- **[RESEARCH NEEDED]** — how to source the JD: portal APIs vs scraping. Legal/ToS considerations per portal.

### 3.4 Application tracker
- Statuses: All, Submitted, In flight, Needs you, Failed, Skipped.
- Search by company. "Approve all" bulk action.

---

## 4. Messaging & Delivery Channels

### 4.1 WhatsApp (primary for India)
- Daily matches delivered to user's chat.
- Reply "yes" to apply.
- Works on any device with WhatsApp.
- **[RESEARCH NEEDED]** — WhatsApp Business API (Meta) pricing & approval; template-message rules;
  cost per conversation.

### 4.2 Email
- Same daily-matches + reply-to-approve flow, adapted to email.
- **[RESEARCH NEEDED]** — transactional email provider (e.g. Resend, SES, Postmark) & cost.

### 4.3 Other channels (carry over)
- Chrome extension, Claude (MCP).

---

## 5. Job Sources & Integrations **[RESEARCH NEEDED — HIGH PRIORITY]**

### 5.1 India portals
- **Naukri.com** (~75M users — must-have), LinkedIn, Indeed India, plus evaluate: Apna, Shine,
  Internshala (freshers), iimjobs (senior).
- Per-portal: API available? ToS on automation? Form structure for auto-apply?

### 5.2 UK portals
- LinkedIn, Indeed UK, **Reed, Totaljobs, CV-Library, Adzuna**. (Adzuna has a public API.)

### 5.3 ATS systems to support for auto-apply
- Global: Workday, Greenhouse, Lever, Ashby, iCIMS, Oracle.
- India-specific: Naukri's native flow, Freshteam, Zoho Recruit, Keka. [RESEARCH NEEDED]

---

## 6. Ethical & Legal Boundaries (derived from research)

- **No fabrication:** "Aggressive" tailoring may rephrase, reorder, and emphasize — never invent
  experience, skills, employers, dates, or credentials. Misrepresentation can void offers and expose
  the user to legal risk.
- **Platform ToS:** automated applying and messaging may violate some portals' terms (esp. LinkedIn).
  Document risk per platform; prefer official APIs; consider on-device automation (as Tsenta does) to
  keep the user in control.
- **Algorithmic monoculture (research link):** because the same ATS/algorithms screen applicants across
  many employers (Bommasani et al.), mass-applying with identical materials can trigger correlated
  rejection. Per-job tailoring is both a feature and a partial mitigation.
- **Data privacy:** resumes contain PII. Define storage, encryption, retention, and deletion.
  India: **DPDP Act 2023**. UK: **UK GDPR**. [RESEARCH NEEDED]

---

## 7. Costs & Pricing **[RESEARCH NEEDED — HIGH PRIORITY]**

Founder goal: keep cost as low as possible (ideally free to operate), and understand the real unit
economics to set a fair subscription price.

Cost drivers to research and estimate:
- LLM API cost per resume parse + per CV/cover-letter tailoring (tokens × price).
- WhatsApp Business API conversation costs.
- Email sending costs.
- Job data acquisition (API fees vs scraping infra).
- Hosting/compute, browser-automation infra, CAPTCHA-solving services.
- Storage/database.

Output: a per-user/per-application cost model → recommended INR/GBP subscription tiers.

---

## 8. Open Questions Log

1. Exact work-eligibility questions per India/UK application forms. (§2 Step 4)
2. Correct preference/background/D&I fields per market. (§2 Step 5)
3. Username vs email-only for ATS accounts. (§2 Step 6a)
4. Which portals expose APIs vs require scraping; ToS/legal per portal. (§5)
5. WhatsApp Business API + email provider costs. (§4, §7)
6. Full LLM unit-economics and resulting pricing. (§7)
7. Recruiter-messaging feasibility per platform. (§2 Step 6b)
8. Data-protection compliance (DPDP Act / UK GDPR). (§6)

---

## Appendix A — Research grounding: Algorithmic Monocultures in Hiring

Bommasani, Bana, Creel, Jurafsky & Liang (FAccT 2026) analyzed 4.19M applications from 3.37M
applicants across 156 employers, all screened by one vendor (pymetrics/Harver). Key relevance to this
product:
- Over 90% of employers use algorithmic screening; a few vendors dominate → **algorithmic monoculture**.
- The same applicants get rejected across many employers more than chance would predict (correlated
  rejection). 4% of applicants to 10+ positions were rejected everywhere.
- Bias persists even without explicit demographic inputs (behavioral proxies).
- **Implication for us:** per-job tailoring and targeting *fit* (not spray-and-pray) is the value prop;
  honest differentiation per application is both ethical and strategically smart against monoculture.
