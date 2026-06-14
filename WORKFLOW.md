# End-to-End Workflow

## AI Job Application Automation Platform — India & UK

> How the system works from a user arriving at the site to a job being submitted on their behalf.

---

## 1. Entry & Market Selection

```
User visits the site
    → Sees market toggle: [🇮🇳 India] [🌍 Abroad (UK)]
    → Selects market → stored as session variable (market = "IN" | "UK")
    → Shown sign-up form (email + password via Supabase Auth)
    → Account created → user row inserted with market value
```

---

## 2. Onboarding — Step 1: Resume Upload

```
User sees dropzone: "Drop your PDF here, or browse"
    → Uploads PDF (max 10MB)
    → Frontend sends PDF to POST /onboarding/resume
    → Backend:
        1. Stores PDF in Supabase Storage (private bucket)
        2. Queues background job: parse_resume
        3. Returns immediately → user sees "Resume — in progress" chip
    
    Background (parallel while user fills Steps 2–3):
        parse_resume job runs:
            → pdfplumber extracts text from PDF
            → Sends to Gemini 1.5 Flash with extraction prompt
            → Receives structured JSON: name, email, phone, skills[], 
              work_experience[], education[], certifications[]
            → Saves to resumes.parsed_data
            → Triggers draft_cover_letter job
            → Emits Supabase realtime event → chip updates to "Resume — Done ✓"
        
        draft_cover_letter job runs:
            → Reads parsed resume data
            → Sends to LLM: "Draft a professional cover letter from this experience"
            → Saves draft to user profile
        
        queue_job_matches job runs:
            → Fetches top 20 jobs from portals matching user's detected title/skills
            → Scores each job vs parsed skills (TF-IDF cosine similarity)
            → Stores in jobs + applications tables
            → Ready to display when user reaches Dashboard
```

---

## 3. Onboarding — Step 2: About You

```
User fills grouped form (autosaved after each section loses focus):

    Section A — Location:
        Address, City, Postal code (PIN for India / Postcode for UK),
        District (India) / County (UK), State/UT (India) / Region (UK)
        → Country locked: India or United Kingdom
    
    Section B — Contact:
        Phone (default +91 India / +44 UK), optional alternate (India only),
        LinkedIn URL
    
    Section C — Work eligibility:
        [India]
            Notice period (dropdown: Immediate / 15 / 30 / 60 / 90 days)
            Current CTC (₹ LPA)
            Expected CTC range (₹ LPA min–max)
            Willing to relocate? (Yes / No)
            Indian citizen? (Yes / No, optional)
        
        [UK]
            Right to work in UK? (Yes / No)
            Require visa sponsorship now or future? (Yes / No)
            Notice period (Immediate / 1 week / 2 weeks / 1 month / 3 months)
    
    Section D — Preferences & D&I:
        Open to in-person? · Willing to relocate? · Can start immediately?
        Reliable transportation? · Need workplace accommodations?
        
        Gender (optional)
        [India] Category: General / OBC / SC / ST (optional, for PSU roles)
        [UK] Ethnicity (UK census categories, optional)
        Disability status (both markets, optional)
        [UK] Sexual orientation (optional)
        
        Additional info (free text, optional)
    
    → Autosave on each section → "Autosaved ✓" indicator
    → User clicks Continue
```

---

## 4. Onboarding — Step 3: Application Setup

```
User fills application preferences:

    Section A — Application password:
        Auto-generated strong password (12+ chars, mixed case, number, special)
        User can regenerate; password hidden by default
        → Encrypted with AES-256-GCM before saving

    Section B — Resume optimisation:
        Off / Honest / Aggressive (segmented control)
        Auto-approve edits toggle
    
    Section C — Cover letter optimisation:
        Off / Honest / Aggressive
        Auto-approve edits toggle
    
    Section D — Preferred roles:
        Multi-tag input: e.g. "Data Analyst", "BI Analyst", "Data Scientist"
    
    Section E — Recruiter message (optional):
        Toggle + short text field
        Hint: "Supported on LinkedIn, Indeed, and Naukri"
    
    → User clicks "Finish setup"
    → Redirected to Dashboard
    → Job matches are already waiting (fetched during Steps 1–2)
```

---

## 5. Dashboard — Browsing Matches

```
User lands on Dashboard:
    → Market indicator shown top bar (🇮🇳 India or 🌍 UK), switchable
    → Job match feed loaded from /jobs/matches (pre-scored, sorted by match %)
    
    Each job card shows:
        Match % badge (e.g. "74% match")
        Job title + company logo
        Location · Workplace type · Posted X days ago
        Top skills as chips (sql · python · +12)
        Salary: ₹ INR (India jobs) / £ GBP (UK jobs) / $ USD (US remote) 
                / "Salary not disclosed" (if not in JD)
        [Pass] [Apply] buttons
    
    Filters (top bar):
        Common: Date · Location · Workplace · Degree · Max experience · Role · Job type
        [India only] CTC range (₹ LPA) · Fresher / Experienced
        [UK only] Sponsors visa · Salary range (£)
    
    Bulk action: "Apply to all N" button
```

---

## 6. Applying to a Job

### Single apply (user clicks Apply on a card):

```
User clicks Apply
    → If Auto-approve ON:
        → Backend queues tailor_application job immediately
    → If Auto-approve OFF:
        → Backend tailors CV + CL (per intensity setting)
        → Returns preview to user
        → User reviews, clicks Confirm
    
    tailor_application job:
        Intensity = Off:
            → Use original uploaded resume + (cover letter if CL opt != Off)
        
        Intensity = Honest:
            → LLM prompt: "Reorder and emphasise experience relevant to this JD.
               Do not add new content. Return full resume."
            → Saves tailored_cv to applications row
        
        Intensity = Aggressive:
            → LLM prompt: "Rewrite this resume to closely match the JD.
               You may rephrase and reorder content.
               NEVER invent experience, credentials, skills, or dates."
            → Saves tailored_cv to applications row
    
    → Chrome extension (if installed) receives apply task:
        → Opens job application URL in background tab
        → Detects ATS type (Workday / iCIMS / Naukri / LinkedIn Easy Apply)
        → Fills fields with tailored resume data + user profile data
        → Submits form
        → Reports success/failure to backend
    
    → Application status updated: pending → submitted (or failed)
    → Tracker row created/updated
```

### Bulk apply ("Apply to all N"):

```
→ Same pipeline as single apply, queued for each job
→ Chrome extension processes sequentially (1 per ~30 seconds to avoid rate limits)
→ Tracker updated live as each completes
```

---

## 7. Daily Job Digest (Email)

```
Cron job runs at 6am (user's timezone):
    → Fetch fresh jobs from portals (Adzuna, JSearch, Naukri scraper)
    → Score against user profile
    → Store new jobs + scores

Cron job runs at 7am:
    → Select top 5 new matches per user
    → Render email template (job cards: title, company, match %, salary, Apply link)
    → Send via Resend.com
    → User can reply "yes" to a job → triggers apply flow via email webhook
```

---

## 8. Application Tracker

```
User opens Tracker:
    → Tabs: All · Submitted · In flight · Needs you · Failed · Skipped
    → Each row: Company · Role · Status · Date · Action
    → Search by company name
    → "Approve all" bulk action for pending-preview applications
    
    Status transitions:
        pending      → Tailored, waiting for user approval (if Auto-approve OFF)
        submitted    → Extension submitted the form successfully
        in_flight    → Awaiting response from employer
        needs_you    → Employer replied, requires user action (e.g. assessment link)
        failed       → Extension failed to submit (CAPTCHA, changed form, etc.)
        skipped      → User clicked Pass
```

---

## 9. WhatsApp Flow (Phase 2)

```
User connects WhatsApp in Settings:
    → Scans QR code / enters phone number
    → Platform sends welcome message via WhatsApp Business API

Daily at 7am:
    → Top 5 matches sent as WhatsApp message with formatted job cards
    → Each card has a "Reply YES to apply" inline button or number

User replies "YES 2" (to apply to job #2):
    → Webhook receives message
    → Triggers apply flow for that job
    → Confirmation message sent: "Applying to [Role] at [Company]… ✓ Done"
```

---

## 10. Chrome Extension Flow

```
Extension installed by user from Chrome Web Store (or direct .crx)
    → User signs in with same account credentials
    → Extension polls /chrome-extension/tasks every 30 seconds
    
On receiving a task (job to apply to):
    1. Opens application URL in new background tab
    2. Detects ATS:
       - Workday: fills standard fields + uploads tailored resume PDF
       - LinkedIn Easy Apply: fills multi-step modal
       - Naukri: fills native application form
       - iCIMS / Oracle: fills form fields
    3. On each field: dispatches InputEvent (not just value assignment)
       so React/Angular forms register the change
    4. If CAPTCHA encountered: marks application as "needs_you", 
       notifies user to complete manually
    5. On success: reports back to API → status = submitted
    6. Closes background tab
```

---

## 11. MCP Server Flow (Claude Integration)

```
User connects their Claude account to the platform via MCP settings:
    → Platform issues MCP server URL + API key
    → User adds to Claude's MCP config

User chats with Claude: "Apply to data analyst jobs in Bangalore under ₹15 LPA"
    → Claude calls search_jobs({query:"data analyst", location:"Bangalore", 
                                  max_ctc:15, market:"IN"})
    → Platform returns matching jobs
    → Claude calls tailor_cv({job_id:"...", intensity:"honest"})
    → Claude calls submit_application({job_id:"..."})
    → Platform triggers Chrome extension apply flow
    → Claude replies: "Applied to 3 positions. Check your Tracker for status."
```

---

## 12. Data Flow Summary

```
User → Frontend (Next.js / Vercel)
    ↕ REST API
Backend (FastAPI / Railway)
    ↕ Supabase (PostgreSQL + Auth + Storage + Realtime)
    ↕ Upstash Redis (ARQ job queue)
    ↕ Gemini / Claude (LLM)
    ↕ Adzuna / JSearch / Naukri scraper (job data)
    ↕ Resend (email)
    ↕ WhatsApp Business API (Phase 2)

User's Browser
    ↕ Chrome Extension (applies to jobs in user's own session)
        ↕ Backend (receives tasks, reports results)

Claude (AI assistant)
    ↕ MCP Server (FastAPI endpoint, same Railway service)
```
