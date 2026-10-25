"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, ExternalLink, FileQuestion, Filter, Search, Sparkles, Terminal } from "lucide-react";
import { useAuth } from "@/AuthContext";

type Difficulty = "Easy" | "Medium" | "Hard";
type Problem = {
  _id: string;
  problem_title: string;
  problem_desc: string;
  problem_level: Difficulty;
  problem_link: string;
  problem_platform_name: string;
};

const difficultyStyle: Record<Difficulty, string> = {
  Easy: "border-emerald-300/15 bg-emerald-300/[.07] text-emerald-200",
  Medium: "border-amber-300/15 bg-amber-300/[.07] text-amber-100",
  Hard: "border-rose-300/15 bg-rose-300/[.07] text-rose-200",
};

function getSafeLink(rawLink: string) {
  try {
    const url = new URL(rawLink);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<"All" | Difficulty>("All");
  const [platform, setPlatform] = useState("All");
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [error, setError] = useState("");
  const [reloadVersion, setReloadVersion] = useState(0);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user) return;

    const controller = new AbortController();

    async function loadProblems() {
      setLoadingProblems(true);
      setError("");
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/problem/all`, {
          signal: controller.signal,
          withCredentials: true,
        });
        if (!Array.isArray(data?.data)) {
          throw new Error("The problem list returned an invalid response.");
        }
        setProblems(data.data);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(axios.isAxiosError(loadError)
          ? loadError.response?.data?.message || "We couldn't load your saved problems. Please try again."
          : loadError instanceof Error ? loadError.message : "We couldn't load your saved problems. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoadingProblems(false);
      }
    }

    void loadProblems();
    return () => controller.abort();
  }, [loading, user, reloadVersion]);

  const platforms = useMemo(
    () => [...new Set(problems.map((problem) => problem.problem_platform_name).filter(Boolean))].sort(),
    [problems],
  );

  const filteredProblems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return problems.filter((problem) => {
      const matchesSearch = !query || [
        problem.problem_title,
        problem.problem_desc,
        problem.problem_platform_name,
      ].some((value) => value?.toLowerCase().includes(query));
      return matchesSearch &&
        (difficulty === "All" || problem.problem_level === difficulty) &&
        (platform === "All" || problem.problem_platform_name === platform);
    });
  }, [problems, search, difficulty, platform]);

  const clearFilters = () => {
    setSearch("");
    setDifficulty("All");
    setPlatform("All");
  };

  return (
    <main className="page-shell min-h-screen px-4 pb-20 sm:px-6">
      <div className="mx-auto max-w-6xl pt-8 sm:pt-12">
        <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-[#b7f36b]/15 bg-[#b7f36b]/[.07] text-[#c9ff87]"><BookOpen size={16} /></span>
            <span>Your practice library</span>
            <span className="text-slate-700">/</span>
            <span className="text-slate-300">Saved problems</span>
          </div>
          <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Keep your momentum</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-.05em] text-white sm:text-5xl">Your saved <span className="text-gradient">challenges.</span></h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">Every problem you generate is collected here, ready to revisit and solve whenever you have time.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/[.07] bg-white/2.5 px-4 py-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#b7f36b]/10 text-[#b7f36b]"><Terminal size={17} /></span>
              <div><p className="text-lg font-semibold leading-none text-white">{loadingProblems ? "—" : problems.length}</p><p className="mt-1 text-[10px] font-semibold tracking-wider text-slate-500">SAVED PROBLEMS</p></div>
            </div>
          </div>
        </motion.header>

        <section className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label className="relative block min-w-0 flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="field pl-11" placeholder="Search problems, descriptions, or platforms…" aria-label="Search saved problems" />
          </label>
          <label className="relative block sm:w-44">
            <Filter size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as "All" | Difficulty)} className="field appearance-none pl-10!" aria-label="Filter by difficulty">
              <option value="All">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>
          <label className="relative block sm:w-48">
            <select value={platform} onChange={(event) => setPlatform(event.target.value)} className="field appearance-none" aria-label="Filter by platform">
              <option value="All">All platforms</option>
              {platforms.map((name) => <option value={name} key={name}>{name}</option>)}
            </select>
          </label>
        </section>

        {loadingProblems ? (
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading problems">
            {[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="surface h-56 animate-pulse rounded-3xl" />)}
          </div>
        ) : error ? (
          <div className="surface mt-7 rounded-3xl p-8 text-center">
            <FileQuestion size={25} className="mx-auto text-rose-200" />
            <p role="alert" className="mt-3 text-sm text-slate-300">{error}</p>
            <button type="button" onClick={() => setReloadVersion((version) => version + 1)} className="mt-4 text-sm font-semibold text-[#b7f36b] hover:text-white">Try again</button>
          </div>
        ) : filteredProblems.length ? (
          <>
            <p className="mt-6 text-sm text-slate-500">Showing <span className="font-medium text-slate-300">{filteredProblems.length}</span> of {problems.length} problems</p>
            <motion.div layout className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredProblems.map((problem, index) => {
                  const safeLink = getSafeLink(problem.problem_link);
                  return (
                    <motion.article key={problem._id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .25, delay: Math.min(index * .035, .18) }} className="group relative flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-white/[.08] bg-[#10161e] p-5 transition hover:-translate-y-1 hover:border-[#b7f36b]/20 hover:bg-[#121a23] sm:p-6">
                      <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-[#b7f36b]/[.05] blur-3xl transition group-hover:bg-[#b7f36b]/[.09]" />
                      <div className="relative flex items-start justify-between gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#b7f36b]/10 bg-[#b7f36b]/[.06] text-[#c9ff87]"><Terminal size={19} /></span>
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${difficultyStyle[problem.problem_level] || "border-white/10 bg-white/[.04] text-slate-300"}`}>{problem.problem_level}</span>
                      </div>
                      <div className="relative mt-5 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-600">{problem.problem_platform_name}</p>
                        <h2 className="mt-2 text-lg font-semibold leading-6 text-white">{problem.problem_title}</h2>
                        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-400">{problem.problem_desc || "Open the original problem to view its full description."}</p>
                      </div>
                      {safeLink ? (
                        <a href={safeLink} target="_blank" rel="noopener noreferrer" className="relative mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/[.06] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-[#b7f36b] hover:text-[#11170b]">Open problem <ExternalLink size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
                      ) : (
                        <p className="relative mt-5 text-xs text-amber-200/80">This problem has an invalid link.</p>
                      )}
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <div className="surface mt-7 rounded-[24px] px-6 py-14 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-300/10 text-violet-200"><Sparkles size={23} /></span>
            <h2 className="mt-5 text-xl font-semibold text-white">{problems.length ? "No problems match those filters." : "Your problem library is ready."}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{problems.length ? "Try a different search or clear your filters." : "Generate a practice set and your saved problems will appear here."}</p>
            {problems.length ? (
              <button type="button" onClick={clearFilters} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#b7f36b]">Clear filters <ArrowRight size={14} /></button>
            ) : (
              <Link href="/practices" className="primary-button mt-5 inline-flex">Find practice problems <ArrowRight size={15} /></Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
