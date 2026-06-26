# Technical Requirements Document (TRD)

## AI Job Application Automation Platform — India & UK Markets

> **Status:** 🟡 Draft
> **Last updated:** 2026-06-14
> **Companion docs:** PRD.md · DESIGN_BRIEF.md

---

## 0. Architecture Philosophy

- **Free-first:** every component chosen for $0 cost at launch; upgrade path documented.
- **Server-side tailoring, client-side applying:** LLM runs on the backend; actual job
  form submission runs in the user's own browser (Chrome extension) to avoid bot detection.
- **Market-aware at data layer:** every user row carries `market = "IN" | "UK"`; every
  job row carries `currency` and `portal`; all queries are market-scoped.

---

## 1. Tech Stack

### 1.1 Frontend

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js 15** (App Router) | SSR, file-based routing, Vercel-native |
| Language | TypeScript | Type safety across the full stack |
| Styling | **Tailwind CSS** | Utility-first; matches 60-30-10 green tokens |
| UI components | **shadcn/ui** | Headless, accessible, customisable |
| State | Zustand (client) + React Query (server) | Lightweight; avoids Redux boilerplate |
| Forms | React Hook Form + Zod | Validation co-located with schema |
| File upload | react-dropzone | Drag-and-drop PDF for Step 1 |
| Hosting | **Vercel** (free hobby tier) | Zero-config Next.js deploy |

**Color tokens (Tailwind config):**
```js
sage:    '#F0FAF4'   // 60% backgrounds
forest:  '#1A3C2E'   // 30% nav, text, borders  
emerald: '#10B981'   // 10% primary buttons, badges
```

### 1.2 Backend

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Runtime | **Python 3.12** | Best AI/ML library ecosystem |
| Framework | **FastAPI** | Async, auto-docs, Pydantic validation |
| Task queue | **ARQ** (async Redis queue) | Lightweight; for background jobs |
| Redis | Upstash (free: 10,000 commands/day) | Serverless Redis for queue + caching |
| Hosting | **Railway** ($5 free credit/month) | Simple deploy, Docker-based |
| PDF extraction | **pdfplumber** (Python, free) | Extract text from uploaded resumes |

### 1.3 Database — Supabase (Free Tier)

- **PostgreSQL** (500MB free)
- **Auth** — email/password built-in; social login (Google) optional
- **Storage** — resume PDF storage (1GB free)
- **Realtime** — live status updates for background parsing chip
- **Auto-generated REST API** — reduces boilerplate for simple CRUD

Upgrade to Supabase Pro ($25/mo) when DB exceeds 500MB (~500+ active users).

### 1.4 LLM Layer

#### Phase 1 (Free / near-free)

| Task | Model | Cost |
|------|-------|------|
| Resume parsing | **Gemini 1.5 Flash** | Free (1M tokens/day via Google AI Studio) |
| Cover letter draft | Gemini 1.5 Flash | Free |
| CV tailoring (Honest) | Gemini 1.5 Flash | Free |
| CV tailoring (Aggressive) | Gemini 1.5 Pro | Free (50 req/day) or Groq Llama 3.1 70B |
| Job match scoring | Gemini 1.5 Flash | Free |

**Setup:** Google AI Studio API key → `google-generativeai` Python package.

#### Phase 2 (Paid, when quality matters)

| Task | Model | Cost (est.) |
|------|-------|-------------|
| Resume parsing | Claude Haiku 4.5 | ~$0.002/resume |
| CV tailoring | Claude Haiku 4.5 | ~$0.008/application |
| Cover letter | Claude Haiku 4.5 | ~$0.005/application |

Enable **prompt caching** on the user profile block — ~90% token cost reduction on the
cached portion (resume + preferences sent once per session, not per job).

#### LLM abstraction layer

Wrap all LLM calls in a provider-agnostic interface so the backend can switch
Gemini ↔ Claude ↔ Groq without changing business logic:

```python
class LLMProvider(Protocol):
    async def complete(self, system: str, user: str) -> str: ...

class GeminiProvider:
    async def complete(self, system: str, user: str) -> str:
        # google-generativeai call
        ...

class ClaudeProvider:
    async def complete(self, system: str, user: str) -> str:
        # anthropic SDK call with caching headers
        ...
```

### 1.5 Job Data

| Source | Coverage | Free Tier | Use |
|--------|----------|-----------|-----|
| **Adzuna API** | UK (strong), India (weak) | 250 calls/day | UK job feed |
| **JSearch (RapidAPI)** | LinkedIn + Indeed aggregated | 500 calls/mo | Both markets |
| **Remotive API** | Remote-only, global | Unlimited, no key | Remote roles |
| **Apify Naukri scraper** | Naukri.com India | ~$5/mo | India feed |

Phase 1: Adzuna (UK) + JSearch (both) + Remotive.
Phase 2: Add Naukri scraper for India. Evaluate Reed/Totaljobs APIs for UK.

### 1.6 Email

| Service | Free Tier | Use |
|---------|-----------|-----|
| **Resend.com** | 3,000 emails/mo, 100/day | Transactional + daily match emails |

Daily match email = WhatsApp replacement for Phase 1.
Add WhatsApp Business API (Meta) in Phase 2 (₹0.11-0.15/message, India).

### 1.7 Chrome Extension

- **Manifest V3**, TypeScript
- Runs in the user's own browser session — uses their cookies, avoids bot detection
- Receives job application tasks via a polling endpoint (or WebSocket) from the backend
- Fills forms using `document.querySelector` + `InputEvent` dispatch
- Supported ATSes (Phase 1): Workday, iCIMS, Naukri, LinkedIn Easy Apply
- No server cost for the actual applying — compute runs on user's machine

### 1.8 MCP Server (Claude Integration)

Exposes tools to Claude (Anthropic's AI assistant) so users can manage applications
through conversation:

```
Tools:
  search_jobs(query, market, filters) → JobListing[]
  get_tracker() → Application[]
  tailor_cv(job_id, intensity) → TailoredCV
  submit_application(job_id) → ApplicationResult
  get_profile() → UserProfile
```

Built with the **Model Context Protocol SDK** (Python). Hosted on Railway alongside the API.

---

## 2. Data Model

### users
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
email         text UNIQUE NOT NULL
market        text NOT NULL CHECK (market IN ('IN','UK'))
created_at    timestamptz DEFAULT now()

-- profile (filled during onboarding)
full_name     text
phone         text
linkedin_url  text
address_line  text
city          text
postal_code   text
district      text
region        text          -- state/UT for India, county for UK

-- eligibility (market-specific, nullable)
notice_period text          -- both markets
current_ctc   numeric       -- India only (LPA)
expected_ctc_min numeric    -- India only
expected_ctc_max numeric    -- India only
right_to_work_uk boolean    -- UK only
requires_sponsorship boolean -- UK only

-- preferences
willing_to_relocate  boolean
open_to_in_person    boolean
can_start_immediately boolean
needs_accommodations boolean

-- D&I (all optional)
gender        text
category_india text         -- General/OBC/SC/ST (India only, optional)
ethnicity_uk  text          -- UK census categories (UK only)
disability    boolean
sexual_orientation text     -- UK only

-- application settings
app_password  text          -- encrypted
resume_opt    text CHECK (resume_opt IN ('off','honest','aggressive'))
cover_letter_opt text CHECK (cover_letter_opt IN ('off','honest','aggressive'))
auto_approve  boolean DEFAULT false
recruiter_message text
preferred_roles text[]
```

### resumes
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id       uuid REFERENCES users(id)
storage_path  text          -- Supabase Storage path
parsed_data   jsonb         -- extracted skills, experience, education
parse_status  text CHECK (parse_status IN ('pending','done','failed'))
created_at    timestamptz DEFAULT now()
```

### jobs
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
external_id   text          -- portal's own ID
portal        text          -- 'naukri','linkedin','adzuna','indeed','reed'
market        text CHECK (market IN ('IN','UK'))
title         text
company       text
location      text
workplace_type text         -- remote/hybrid/onsite
salary_min    numeric
salary_max    numeric
currency      text          -- INR/GBP/USD
salary_disclosed boolean DEFAULT true
description   text
skills        text[]
posted_at     timestamptz
fetched_at    timestamptz DEFAULT now()
```

### applications
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id       uuid REFERENCES users(id)
job_id        uuid REFERENCES jobs(id)
status        text CHECK (status IN ('pending','submitted','in_flight','needs_you','failed','skipped'))
match_score   integer       -- 0-100
tailored_cv   text          -- tailored resume content
tailored_cl   text          -- tailored cover letter
created_at    timestamptz DEFAULT now()
applied_at    timestamptz
```

---

## 3. API Endpoints

```
POST   /auth/signup              -- email + password + market
POST   /auth/login
POST   /onboarding/resume        -- upload PDF → triggers background parse
PUT    /onboarding/about-you     -- Step 2 fields (autosaved)
PUT    /onboarding/app-setup     -- Step 3 fields (autosaved)

GET    /jobs                     -- paginated, filtered by market + filters
GET    /jobs/:id                 -- job detail
GET    /jobs/matches             -- personalised match feed for user

GET    /applications             -- tracker
POST   /applications/:job_id/apply
POST   /applications/:job_id/skip
POST   /applications/apply-all   -- bulk apply to current feed

GET    /profile
PUT    /profile

GET    /mcp/tools                -- MCP tool manifest
POST   /mcp/invoke               -- MCP tool call
```

---

## 4. Background Jobs (ARQ + Upstash Redis)

| Job | Trigger | What it does |
|-----|---------|--------------|
| `parse_resume` | On PDF upload | pdfplumber → LLM extraction → update `resumes.parsed_data` |
| `draft_cover_letter` | After parse done | LLM generates first-pass cover letter |
| `queue_job_matches` | After parse done | Fetch jobs from portals, score against profile |
| `daily_job_fetch` | Cron: 6am user-local time | Refresh job feed per market |
| `send_daily_digest` | Cron: 7am user-local time | Email top 5 matches via Resend |
| `tailor_application` | On Apply action | LLM tailors CV + CL per job per intensity setting |

---

## 5. Resume Parsing Pipeline

```
PDF uploaded
    → pdfplumber.extract_text()
    → chunk if > 4000 tokens
    → Gemini 1.5 Flash prompt:
        "Extract: name, email, phone, skills[], work_experience[{title,company,start,end,bullets[]}],
         education[], certifications[], languages[]"
    → validate JSON schema with Pydantic
    → store in resumes.parsed_data
    → emit Supabase realtime event → frontend chip updates to "Done ✓"
```

---

## 6. CV Tailoring Pipeline

```
User clicks Apply (or Auto-approve)
    → load user.parsed_data + job.description
    → select prompt by intensity:
        Off:         return original resume text unchanged
        Honest:      "Reorder and emphasise relevant experience. No new content."
        Aggressive:  "Rewrite to match JD closely. Rephrase and reorder only.
                      NEVER invent experience, credentials, skills, or dates."
    → LLM call (Gemini Flash for Honest, Gemini Pro for Aggressive)
    → store tailored_cv in applications row
    → send to Chrome extension for form filling
```

---

## 7. Job Match Scoring

Simple cosine similarity on skill vectors (Phase 1 — no ML infra needed):

```python
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

def score_match(user_skills: list[str], job_skills: list[str]) -> int:
    vec = TfidfVectorizer()
    matrix = vec.fit_transform([
        ' '.join(user_skills),
        ' '.join(job_skills)
    ])
    score = cosine_similarity(matrix[0], matrix[1])[0][0]
    return round(score * 100)
```

Phase 2: replace with LLM-based semantic scoring or fine-tuned embedding model.

---

## 8. Security

| Concern | Approach |
|---------|----------|
| Auth | Supabase Auth (JWT, httpOnly cookies) |
| App password (ATS) | AES-256-GCM encryption at rest; key stored in Railway env var |
| Resume PII | Supabase Storage with private bucket; signed URLs only |
| Row-level security | Supabase RLS: `user_id = auth.uid()` on all tables |
| API | Rate limiting via FastAPI middleware (slowapi) |
| LLM prompt injection | Sanitise job description before injecting into prompts |
| Data retention | Delete parsed data on account deletion; 90-day logs max |

**Regulations:**
- **India DPDP Act 2023:** explicit consent before collecting PII; right to erase.
- **UK GDPR:** lawful basis for processing; privacy notice required; right to erasure.

---

## 9. Cost Model

### Month 0 (Free tier)

| Component | Service | Cost |
|-----------|---------|------|
| Database + Auth + Storage | Supabase free | $0 |
| Backend hosting | Railway ($5 credit) | $0 |
| Frontend hosting | Vercel hobby | $0 |
| LLM | Gemini 1.5 Flash | $0 |
| Job data | Adzuna + JSearch free | $0 |
| Email | Resend free (3k/mo) | $0 |
| Redis (queue) | Upstash free | $0 |
| **Total** | | **$0** |

### Month 6 (100 active users, 600 apps/user/mo)

| Component | Cost/mo |
|-----------|---------|
| Supabase Pro | $25 |
| Railway (2 services) | ~$20 |
| Claude Haiku (with caching) | ~$50 |
| Naukri scraper (Apify) | $5 |
| Resend (10k emails) | $0 (free) |
| WhatsApp Business API (India) | ~₹500 (~$6) |
| **Total** | **~$106/mo** |

Break-even at **~21 paying users** at ₹499/month (~$6) pricing.

---

## 10. Deployment Checklist

- [ ] Supabase project created + schema migrated
- [ ] Supabase RLS policies enabled on all tables
- [ ] Next.js frontend deployed to Vercel
- [ ] FastAPI backend deployed to Railway
- [ ] Google AI Studio API key set in Railway env
- [ ] Resend API key set in Railway env
- [ ] Adzuna API key set in Railway env
- [ ] ARQ worker deployed as second Railway service
- [ ] Upstash Redis URL set in Railway env
- [ ] Chrome extension packed and tested on Workday + Naukri
- [ ] MCP server manifest published

---

## 11. Phase Roadmap

| Phase | Milestone | Stack additions |
|-------|-----------|-----------------|
| **0** | Deploy onboarding + dashboard skeleton | Supabase + Vercel + Gemini |
| **1** | Resume parsing working end-to-end | pdfplumber + ARQ + Upstash |
| **2** | Job feed live (UK via Adzuna, both via JSearch) | Adzuna + JSearch + cron |
| **3** | CV tailoring + Chrome extension auto-apply | Gemini → Claude Haiku |
| **4** | Daily email digest | Resend |
| **5** | Naukri India integration | Apify scraper |
| **6** | WhatsApp delivery | Meta Business API |
| **7** | MCP server | MCP SDK |
| **8** | Pricing + payments | Stripe / Razorpay |
