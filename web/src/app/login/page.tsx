"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

export default function LoginPage() {
  return <Suspense fallback={null}><LoginInner /></Suspense>;
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/app/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push(next);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-sage text-forest flex flex-col items-center justify-center px-8 gap-7">
      <div className="flex items-baseline gap-[7px]">
        <div className="text-2xl font-bold tracking-[-0.02em]">obisa</div>
        <div className="w-[7px] h-[7px] rounded-[2px] bg-emerald" />
      </div>
      <form onSubmit={onSubmit} className="w-full max-w-[420px] bg-white border border-mint rounded-2xl p-8 shadow-[0_2px_12px_rgba(26,60,46,0.06)] flex flex-col gap-4">
        <div className="text-[24px] font-bold tracking-[-0.02em]">Welcome back</div>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="border border-mint rounded-lg px-3 py-2.5 outline-none focus:border-emerald" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Password</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="border border-mint rounded-lg px-3 py-2.5 outline-none focus:border-emerald" />
        </label>
        {error && <div className="text-xs text-red-600">{error}</div>}
        <button disabled={loading} type="submit" className="bg-forest text-white rounded-lg py-2.5 font-semibold hover:bg-forest/90 disabled:opacity-50">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <div className="text-xs text-muted text-center">
          Don&apos;t have an account? <Link href="/signup" className="text-emerald font-semibold">Sign up</Link>
        </div>
      </form>
    </main>
  );
}
