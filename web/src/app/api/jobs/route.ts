import { NextRequest, NextResponse } from "next/server";
import type { Job } from "@/lib/types";

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(li|p|div|h[1-6])[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractReqs(html: string): string[] {
  const text = stripHtml(html);
  const lines = text
    .split(/\n/)
    .map((l) => l.replace(/^[\s•\-*]+/, "").trim())
    .filter((l) => l.length > 10 && l.length < 200);
  return lines.slice(0, 5);
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

interface RemotiveJob {
  id: number;
  title: string;
  company_name: string;
  candidate_required_location: string;
  job_type: string;
  publication_date: string;
  salary: string;
  url: string;
  description: string;
  tags: string[];
  category: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const market = (searchParams.get("market") || "IN").toLowerCase() as
    | "in"
    | "uk";
  const search = searchParams.get("search") || "";
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  try {
    const apiUrl = new URL("https://remotive.com/api/remote-jobs");
    if (search) apiUrl.searchParams.set("search", search);
    apiUrl.searchParams.set("limit", String(limit));

    const res = await fetch(apiUrl.toString(), {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Remotive API returned ${res.status}`);
    }

    const data = await res.json();
    const remotiveJobs: RemotiveJob[] = data.jobs || [];

    const jobs: Job[] = remotiveJobs.map((rj, i) => {
      const about = stripHtml(rj.description).slice(0, 500);
      const reqs = extractReqs(rj.description);
      const logo =
        rj.company_name
          .replace(/[^A-Za-z]/g, "")
          .slice(0, 2)
          .toUpperCase() || "??";
      const match = 60 + Math.floor(Math.random() * 36); // 60-95

      return {
        id: String(rj.id),
        m: market as "in" | "uk" | "both",
        title: rj.title,
        co: rj.company_name,
        logo,
        dark: i % 2 === 0,
        loc: rj.candidate_required_location || "Remote",
        mode: rj.job_type || "full_time",
        age: relativeTime(rj.publication_date),
        salary: rj.salary || null,
        est: null,
        match,
        chips: (rj.tags || []).slice(0, 5),
        more: Math.max(0, (rj.tags || []).length - 5),
        src: rj.url,
        sponsors: false,
        about,
        reqs,
      };
    });

    return NextResponse.json({ jobs });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ jobs: [], error: message }, { status: 500 });
  }
}
