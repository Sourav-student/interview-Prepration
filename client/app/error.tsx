"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Application route error:", error);
  }, [error]);

  return (
    <main className="page-shell flex items-center justify-center px-5 py-16 sm:px-8">
      <section className="surface w-full max-w-xl rounded-[28px] p-8 text-center sm:p-12" role="alert">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-500">
          <AlertTriangle size={24} />
        </span>
        <p className="eyebrow mt-6">A small interruption</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">This page didn’t load as expected.</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
          Your progress is safe. Try loading the page again, or return to the home page.
        </p>
        {error.digest && <p className="mt-4 text-xs text-slate-500">Reference: {error.digest}</p>}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => unstable_retry()} className="primary-button">
            Try again <RotateCcw size={15} />
          </button>
          <Link href="/" className="secondary-button">Back to home</Link>
        </div>
      </section>
    </main>
  );
}
