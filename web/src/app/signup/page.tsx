"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import { useApp } from "@/lib/store";

export default function SignupPage() {
  const router = useRouter();
  const market = useApp((s) => s.market);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = supabaseBrowser();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("profiles").insert({ id: data.user.id, email, market });
    }
    setLoading(false);
    router.push("/onboarding/resume");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-sage text-forest flex flex-col items-center justify-center px-8 gap-7">
      <div className="flex items-baseline gap-[7px]">
        <div className="text-2xl font-bold tracking-[-0.02em]">obisa</div>
        <div className="w-[7px] h-[7px] rounded-[2px] bg-emerald" />
      </div>
      <form onSubmit={onSubmit} className="w-full max-w-[420px] bg-white border border-mint rounded-2xl p-8 shadow-[0_2px_12px_rgba(26,60,46,0.06)] flex flex-col gap-4">
        <div className="text-[24px] font-bold tracking-[-0.02em]">Create your obisa account</div>
        <div className="text-sm text-muted">Market: <span className="font-semibold text-forest">{market === "IN" ? "🇮🇳 India" : "🌍 UK"}</span> — change on the landing page if needed.</div>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="border border-mint rounded-lg px-3 py-2.5 outline-none focus:border-emerald" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Password (min 8 chars)</span>
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="border border-mint rounded-lg px-3 py-2.5 outline-none focus:border-emerald" />
        </label>
        {error && <div className="text-xs text-red-600">{error}</div>}
        <button disabled={loading} type="submit" className="bg-forest text-white rounded-lg py-2.5 font-semibold hover:bg-forest/90 disabled:opacity-50">
          {loading ? "Creating account…" : "Create account"}
        </button>
        <div className="text-xs text-muted text-center">
          Already have an account? <Link href="/login" className="text-emerald font-semibold">Sign in</Link>
        </div>
      </form>
    </main>
  );
}
