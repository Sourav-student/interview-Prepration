"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BookOpen, ExternalLink, FileQuestion, Library, LoaderCircle, Search, Sparkles } from "lucide-react";

type DsaSheet = {
  _id: string;
  author: string;
  sheet_link: string;
  createdAt?: string;
};

function getSafeLink(rawLink: string) {
  try {
    const url = new URL(rawLink);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export default function DsaSheetsPage() {
  const [sheets, setSheets] = useState<DsaSheet[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadSheets() {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/sheet/all`, {
          signal: controller.signal,
        });
        setSheets(Array.isArray(data?.data) ? data.data : []);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(axios.isAxiosError(loadError)
          ? loadError.response?.data?.message || "We couldn't load the DSA sheets. Please try again."
          : "We couldn't load the DSA sheets. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadSheets();
    return () => controller.abort();
  }, []);

  const filteredSheets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sheets
      .filter((sheet) => !query || sheet.author?.toLowerCase().includes(query))
      .sort((a, b) => a.author.localeCompare(b.author));
  }, [sheets, search]);

  return (
    <main className="page-shell px-5 pb-20 sm:px-8">
      <div className="mx-auto max-w-6xl pt-5">
        <motion.header initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-cyan-300/15 bg-cyan-300/[.07] text-cyan-200"><Library size={16} /></span>
            <span>Curated practice library</span>
            <span className="text-slate-700">/</span>
            <span className="text-slate-300">DSA sheets</span>
          </div>
          <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Practice with a plan</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-.05em] text-white sm:text-5xl">Find your next <span className="text-gradient">problem set.</span></h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">Explore DSA sheets shared by different authors. Pick a roadmap that fits your style and keep building interview-ready problem-solving skills.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/[.07] bg-white/[.025] px-4 py-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#b7f36b]/10 text-[#b7f36b]"><BookOpen size={17} /></span>
              <div><p className="text-lg font-semibold leading-none text-white">{loading ? "—" : sheets.length}</p><p className="mt-1 text-[10px] font-semibold tracking-wider text-slate-500">AVAILABLE SHEETS</p></div>
            </div>
          </div>
        </motion.header>

        <section className="mt-9">
          <label className="relative block max-w-md">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="field pl-11" placeholder="Search by author…" aria-label="Search DSA sheets by author" />
          </label>
        </section>

        {loading ? (
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading DSA sheets">
            {[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="surface h-52 animate-pulse rounded-[24px]" />)}
          </div>
        ) : error ? (
          <div className="surface mt-7 rounded-[24px] p-8 text-center">
            <FileQuestion size={25} className="mx-auto text-rose-200" />
            <p className="mt-3 text-sm text-slate-300">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-sm font-semibold text-[#b7f36b] hover:text-white">Try again</button>
          </div>
        ) : filteredSheets.length ? (
          <motion.div layout className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredSheets.map((sheet, index) => {
                const safeLink = getSafeLink(sheet.sheet_link);
                return (
                  <motion.article key={sheet._id} layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .28, delay: Math.min(index * .04, .2) }} className="group relative flex min-h-56 flex-col overflow-hidden rounded-[24px] border border-white/[.08] bg-[#10161e] p-5 transition hover:-translate-y-1 hover:border-cyan-200/20 hover:bg-[#121a23] sm:p-6">
                    <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-cyan-300/[.06] blur-3xl transition group-hover:bg-cyan-300/[.1]" />
                    <div className="relative flex items-start justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-200/10 bg-cyan-200/[.06] text-cyan-100"><BookOpen size={19} /></span>
                      <span className="rounded-full border border-white/[.08] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-slate-500">DSA SHEET</span>
                    </div>
                    <div className="relative mt-6 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-600">CURATED BY</p>
                      <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">{sheet.author}</h2>
                      <p className="mt-2 text-sm leading-5 text-slate-500">A structured set of data structures and algorithms practice problems.</p>
                    </div>
                    {safeLink ? (
                      <a href={safeLink} target="_blank" rel="noopener noreferrer" className="relative mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/[.06] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-[#b7f36b] hover:text-[#11170b]">Open sheet <ExternalLink size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
                    ) : (
                      <p className="relative mt-5 text-xs text-amber-200/80">This sheet has an invalid link.</p>
                    )}
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="surface mt-7 rounded-[24px] px-6 py-14 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-300/10 text-violet-200"><Sparkles size={23} /></span>
            <h2 className="mt-5 text-xl font-semibold text-white">{search ? "No authors match that search." : "Your DSA library is getting ready."}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{search ? "Try another author name to find a sheet." : "Check back soon for curated sheets from the community."}</p>
            {search && <button onClick={() => setSearch("")} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#b7f36b]">Clear search <ArrowUpRight size={14} /></button>}
          </div>
        )}

        {!loading && !error && sheets.length > 0 && <p className="mt-5 text-xs text-slate-600">Showing {filteredSheets.length} of {sheets.length} sheets · Links open in a new tab.</p>}
      </div>
    </main>
  );
}
