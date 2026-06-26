import type { Job, Msg, TrackRow, TrackStatus } from "./types";

export const JOBS: Job[] = [
  { id: "j1", m: "in", title: "Senior Data Analyst", co: "Meridian Labs", logo: "ML", dark: true, loc: "Bengaluru, India", mode: "Hybrid", age: "2d ago", salary: "₹18–24 LPA", est: null, match: 74, chips: ["sql", "excel", "python", "tableau"], more: 12, src: "boards.greenhouse.io", sponsors: false,
    about: "Own reporting and deep-dive analysis for the payments vertical. You will partner with product and finance to turn raw event data into decisions, and build the dashboards the whole company runs on.",
    reqs: ["4+ years in analytics, ideally B2C or fintech", "Expert SQL; comfortable with Python for analysis", "Experience with Tableau or similar BI tooling", "Strong written communication — you will present to leadership"] },
  { id: "j2", m: "in", title: "Analytics Engineer", co: "Kavarna", logo: "KV", dark: false, loc: "Pune, India", mode: "Hybrid", age: "3d ago", salary: null, est: null, match: 91, chips: ["dbt", "sql", "airflow", "python"], more: 8, src: "kavarna.naukri.com", sponsors: false,
    about: "Build and maintain the transformation layer between our warehouse and every dashboard in the company. Small data team, large surface area, lots of ownership.",
    reqs: ["2+ years with dbt or similar transformation tooling", "Deep SQL and data modeling instincts", "Experience operating Airflow or Dagster in production", "Bonus: exposure to event pipelines (Kafka, Segment)"] },
  { id: "j3", m: "in", title: "BI Analyst", co: "Suryadeep Finance", logo: "SF", dark: false, loc: "Mumbai, India", mode: "On-site", age: "5d ago", salary: "₹12–16 LPA", est: null, match: 66, chips: ["power bi", "dax", "sql"], more: 5, src: "suryadeep.wd3.myworkdayjobs.com", sponsors: false,
    about: "Join the lending analytics team to build Power BI dashboards for credit risk and collections. You will work directly with the head of risk.",
    reqs: ["2+ years with Power BI and DAX", "Solid SQL", "NBFC or banking domain knowledge is a plus", "Comfortable with monthly regulatory reporting cycles"] },
  { id: "j4", m: "both", title: "Data Scientist", co: "Ostrove", logo: "OS", dark: true, loc: "Remote", mode: "Remote · paid in USD", age: "1d ago", salary: "$120k", est: { in: "≈ ₹1.0 Cr/yr — estimate", uk: "≈ £95k/yr — estimate" }, match: 68, chips: ["python", "ml", "sql", "experimentation"], more: 12, src: "jobs.lever.co", sponsors: false,
    about: "Remote-first marketplace company hiring a data scientist for the growth team. You will design experiments, build causal models, and ship measurable lift.",
    reqs: ["3+ years in product data science", "Strong experimentation and causal inference background", "Production Python; comfort with modern ML tooling", "Fully remote — overlap with US East mornings required"] },
  { id: "j5", m: "in", title: "Product Analyst", co: "Trellim", logo: "TR", dark: false, loc: "Hyderabad, India", mode: "Remote (India)", age: "6d ago", salary: "₹14–20 LPA", est: null, match: 59, chips: ["sql", "mixpanel", "a/b testing"], more: 4, src: "boards.greenhouse.io", sponsors: false,
    about: "First dedicated analyst on a fast-growing SaaS product. Define metrics from scratch, instrument the funnel, and influence the roadmap directly.",
    reqs: ["2+ years in product analytics", "Fluent SQL and a product sense to match", "Hands-on with Mixpanel/Amplitude", "Startup pace — ambiguity is the job"] },
  { id: "j6", m: "uk", title: "BI Analyst", co: "Northwind Analytics", logo: "NA", dark: false, loc: "London, UK", mode: "On-site", age: "5h ago", salary: "£45,000–£55,000", est: null, match: 82, chips: ["power bi", "sql", "dax"], more: 8, src: "nw.wd5.myworkdayjobs.com", sponsors: true,
    about: "Consultancy serving retail clients across the UK. You will own client-facing dashboards end to end and present insights in fortnightly reviews.",
    reqs: ["2+ years with Power BI in a client-facing role", "Strong SQL and data modeling", "Right to work in the UK, or visa sponsorship — we sponsor", "Excellent presentation skills"] },
  { id: "j7", m: "uk", title: "Senior Data Analyst", co: "Fenwick & Gray", logo: "FG", dark: true, loc: "Manchester, UK", mode: "Hybrid", age: "2d ago", salary: "£52,000", est: null, match: 77, chips: ["sql", "python", "looker"], more: 9, src: "boards.greenhouse.io", sponsors: false,
    about: "E-commerce group hiring a senior analyst for the trading team. Daily trading insight, weekly forecasting, and a direct line to the commercial director.",
    reqs: ["4+ years in retail or e-commerce analytics", "Expert SQL; Python for forecasting", "Looker or similar modern BI stack", "This role does not offer visa sponsorship"] },
  { id: "j8", m: "uk", title: "Analytics Consultant", co: "Bracken Insights", logo: "BI", dark: false, loc: "Edinburgh, UK", mode: "Hybrid", age: "4d ago", salary: null, est: null, match: 71, chips: ["sql", "tableau", "snowflake"], more: 6, src: "bracken.icims.com", sponsors: false,
    about: "Boutique analytics consultancy working with public-sector and energy clients across Scotland. Varied projects, small teams, high trust.",
    reqs: ["3+ years in analytics or consulting", "Tableau and Snowflake experience", "Comfortable owning client relationships", "Occasional travel within the UK"] },
  { id: "j9", m: "uk", title: "Data Engineer", co: "Veldt Energy", logo: "VE", dark: true, loc: "Leeds, UK", mode: "Hybrid", age: "1d ago", salary: "£60,000–£70,000", est: null, match: 64, chips: ["python", "spark", "aws"], more: 10, src: "veldt.wd5.myworkdayjobs.com", sponsors: true,
    about: "Renewables company scaling its grid-data platform. You will build the pipelines that move turbine telemetry into the analytics warehouse.",
    reqs: ["3+ years building data pipelines in production", "Python, Spark, and AWS (Glue/EMR)", "Visa sponsorship available for the right candidate", "Energy domain interest a plus"] },
];

export const TRACK: TrackRow[] = [
  { id: "t1", co: "Meridian Labs", logo: "ML", dark: true, role: "Senior Data Analyst", status: "Applied", date: "12 Jun" },
  { id: "t2", co: "Ostrove", logo: "OS", dark: true, role: "Data Scientist", status: "Interviewing", date: "10 Jun" },
  { id: "t3", co: "Kavarna", logo: "KV", dark: false, role: "Analytics Engineer", status: "Assessment", date: "9 Jun" },
  { id: "t4", co: "Northbeam Tech", logo: "NT", dark: true, role: "Data Analyst", status: "Offer", date: "28 May" },
  { id: "t5", co: "Suryadeep Finance", logo: "SF", dark: false, role: "BI Analyst", status: "Rejected", date: "2 Jun" },
  { id: "t6", co: "Trellim", logo: "TR", dark: false, role: "Product Analyst", status: "Ghosted", date: "21 May" },
  { id: "t7", co: "Helio Systems", logo: "HS", dark: false, role: "Junior Data Scientist", status: "Applied", date: "11 Jun" },
];

export const STATUS_COLORS: Record<TrackStatus, { bg: string; fg: string }> = {
  Applied: { bg: "#DBEAFE", fg: "#1D4ED8" },
  Interviewing: { bg: "#D1FAE5", fg: "#047857" },
  Assessment: { bg: "#FEF3C7", fg: "#B45309" },
  Offer: { bg: "#1A3C2E", fg: "#FFFFFF" },
  Ghosted: { bg: "#F3F4F6", fg: "#6B7280" },
  Rejected: { bg: "#FEE2E2", fg: "#B91C1C" },
};

export const MSGS: Msg[] = [
  { id: "m1", tag: "Interview", from: "Priya Nair · Meridian Labs", addr: "priya.nair@meridianlabs.com", subj: "Interview availability — Senior Data Analyst", date: "Today, 9:41", body: ["Hi Alistair,", "Thanks for applying to the Senior Data Analyst role. The team enjoyed your profile and we would love to set up a 45-minute conversation with our analytics lead this week.", "Could you share two or three slots that work for you between Tuesday and Friday? We are flexible on timing given notice periods.", "Best,", "Priya Nair · Talent, Meridian Labs"] },
  { id: "m2", tag: "Verification", from: "Workday", addr: "no-reply@workday.com", subj: "Your verification code", date: "Today, 8:15", body: ["Your one-time verification code is:", "482913", "This code expires in 10 minutes. obisa auto-filled this code on your Suryadeep Finance application — no action needed."] },
  { id: "m3", tag: "Assessment", from: "Kavarna Talent", addr: "talent@kavarna.in", subj: "Complete your online assessment", date: "Yesterday", body: ["Hello Alistair,", "As the next step for the Analytics Engineer position, please complete a 60-minute SQL and data-modeling assessment within the next 5 days.", "The assessment link is personal to you. Good luck!"] },
  { id: "m4", tag: "Offer", from: "Northbeam Tech HR", addr: "hr@northbeam.tech", subj: "Offer letter — Data Analyst", date: "28 May", body: ["Dear Alistair,", "We are delighted to extend an offer for the Data Analyst position at Northbeam Tech. Your offer letter and compensation details are attached.", "Please review and respond within 7 working days. We are excited to have you on board."] },
  { id: "m5", tag: "Reminder", from: "obisa", addr: "reminders@obisa.app", subj: "2 applications need your approval", date: "27 May", body: ["Two tailored resumes are waiting for your review before we can submit:", "Bracken Insights — Analytics Consultant", "Veldt Energy — Data Engineer", "Approve them from your dashboard, or switch on auto-approve in Settings to skip this step."] },
  { id: "m6", tag: "Rejection", from: "Suryadeep Finance", addr: "careers@suryadeep.in", subj: "Update on your application", date: "2 Jun", body: ["Dear candidate,", "Thank you for your interest in the BI Analyst role. After careful review, we have decided to move forward with other candidates at this time.", "We encourage you to apply for future openings that match your profile."] },
];

export const TAG_COLORS: Record<string, { bg: string; fg: string }> = {
  Verification: { bg: "#DBEAFE", fg: "#1D4ED8" },
  Rejection: { bg: "#FEE2E2", fg: "#B91C1C" },
  Interview: { bg: "#D1FAE5", fg: "#047857" },
  Assessment: { bg: "#FEF3C7", fg: "#B45309" },
  Reminder: { bg: "#F3F4F6", fg: "#6B7280" },
  Offer: { bg: "#1A3C2E", fg: "#FFFFFF" },
};
