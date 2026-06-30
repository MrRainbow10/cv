"use client";

import { useState, useEffect } from "react";
import type { Job } from "./types";
import { useApp } from "./store";

export function useJobs(market: "IN" | "UK", search: string) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheJob = useApp((s) => s.cacheJob);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ market, search, limit: "30" });
    fetch(`/api/jobs?${params}`)
      .then((r) => r.json())
      .then((data) => {
        const fetched: Job[] = data.jobs || [];
        setJobs(fetched);
        fetched.forEach(cacheJob);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [market, search, cacheJob]);

  return { jobs, loading, error };
}
