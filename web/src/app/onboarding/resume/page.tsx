"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { supabaseBrowser } from "@/lib/supabase";

export default function ResumeStep() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [referral, setReferral] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  async function onContinue() {
    setError(null);
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    if (file) {
      setUploading(true);
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("resumes").upload(path, file, { upsert: true, contentType: "application/pdf" });
      if (upErr) { setError(upErr.message); setUploading(false); return; }
      await supabase.from("resumes").insert({ user_id: user.id, storage_path: path, filename: file.name, size_bytes: file.size });
    }
    if (referral) await supabase.from("profiles").update({ referral_code: referral }).eq("id", user.id);
    setUploading(false);
    router.push("/onboarding/about");
  }

  return (
    <div className="flex flex-col px-16 pt-14 pb-9 max-w-[660px] min-h-full">
      <div className="text-[13px] font-semibold text-emerald mb-3">Step 1 of 3</div>
      <div className="flex flex-col gap-2 mb-6">
        <div className="text-[30px] font-bold tracking-[-0.02em]">Upload your resume.</div>
        <div className="text-sm leading-[1.55] text-muted">PDF only, under 10MB. We parse it, draft a cover letter, and have matches waiting by the time you finish setup.</div>
      </div>

      {!file ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-emerald/40 rounded-xl bg-white py-11 px-6 flex flex-col items-center gap-1.5 hover:border-emerald hover:bg-mint/40 transition-colors"
        >
          <div className="text-[15px] font-semibold">
            Drop your PDF here, or <span className="text-emerald underline">browse</span>
          </div>
          <div className="text-xs text-muted">Resume · PDF only · up to 10MB</div>
          <input ref={inputRef} type="file" accept="application/pdf" onChange={onPick} className="hidden" />
        </button>
      ) : (
        <div className="border border-mint rounded-xl bg-white py-[18px] px-5 flex items-center gap-3.5">
          <div className="w-[42px] h-[42px] rounded-[10px] bg-red-100 text-red-700 text-[11px] font-bold flex items-center justify-center">PDF</div>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{file.name}</div>
            <div className="text-xs text-muted">{Math.round(file.size / 1024)} KB · parsing in background</div>
          </div>
          <button onClick={() => setFile(null)} className="text-[13px] text-muted hover:text-red-500">Remove</button>
        </div>
      )}

      <div className="flex flex-col gap-1.5 mt-5">
        <div className="text-[13px] font-semibold">Referral code <span className="font-normal text-muted">· optional</span></div>
        <input
          value={referral}
          onChange={(e) => setReferral(e.target.value)}
          placeholder="e.g. JOHN1234"
          className="w-full bg-white border border-mint rounded-[10px] px-3.5 py-[11px] text-sm text-forest outline-none focus:border-emerald"
        />
      </div>

      {error && <div className="text-xs text-red-600 mt-3">{error}</div>}
      <div className="flex-1 min-h-8" />
      <div className="flex items-center justify-between mt-8">
        <div className="text-xs text-muted">Takes about 30 seconds · Step 1 of 3</div>
        <button
          onClick={onContinue}
          disabled={uploading}
          className="bg-emerald text-white text-sm font-semibold px-6 py-3 rounded-[10px] flex items-center gap-2 hover:brightness-[0.93] disabled:opacity-50"
        >
          {uploading ? "Uploading…" : <>Continue <span className="bg-white/20 rounded-[5px] px-[7px] py-[1px] text-xs">↵</span></>}
        </button>
      </div>
    </div>
  );
}
