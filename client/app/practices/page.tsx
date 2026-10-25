"use client";

import { useEffect, useState, type FormEvent } from "react";
import axios, { isAxiosError } from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/AuthContext";
import { ArrowRight, BookOpen, ChevronDown, Code2, Command, ExternalLink, LoaderCircle, Search, Sparkles } from "lucide-react";

type Difficulty = "Easy" | "Medium" | "Hard";
type GeneratedProblem = {
  problem_title: string;
  problem_desc: string;
  problem_level: Difficulty;
  problem_link: string;
  problem_platform_name: string;
};

const suggestions = ["Arrays", "Dynamic programming", "SQL", "Trees & graphs"];
const difficultyStyle: Record<Difficulty, string> = {
  Easy: "border-emerald-300/15 bg-emerald-300/[.07] text-emerald-200",
  Medium: "border-amber-300/15 bg-amber-300/[.07] text-amber-100",
  Hard: "border-rose-300/15 bg-rose-300/[.07] text-rose-200",
};

export default function PracticesPage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [searchedTopic, setSearchedTopic] = useState("");
  const [problems, setProblems] = useState<GeneratedProblem[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  const insertProblems = async (questions: GeneratedProblem[]) => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/problem/save`,
      { problems: questions },
      { withCredentials: true },
    );
  };

  const searchTopic = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      setError("Enter a topic to find practice questions.");
      return;
    }
    setError("");
    setLoadingResults(true);
    setSearchedTopic(cleanTopic);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/problems`, { topic: cleanTopic, difficulty }, { withCredentials: true });
      const questions = res.data?.data;
      if (!Array.isArray(questions) || questions.length < 1 || questions.length > 5) throw new Error("The question service returned an invalid set. Try again.");
      await insertProblems(questions);
      setProblems(questions);
    } catch (err) {
      setProblems([]);
      setError(isAxiosError(err) ? err.response?.data?.message || "Could not load questions right now. Please try again." : err instanceof Error ? err.message : "Could not load questions right now. Please try again.");
    } finally {
      setLoadingResults(false);
    }
  };

  return (
    <main className="page-shell min-h-screen px-4 pb-20 sm:px-6">
      <div className="mx-auto max-w-6xl pt-8 sm:pt-12">
        <header className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">A smarter way to practice</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-.055em] text-white sm:text-5xl">Find your next <span className="text-gradient">challenge.</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">Search a topic to get a focused set of important coding questions and build confidence one problem at a time.</p>
        </header>

        <form onSubmit={searchTopic} className="surface mx-auto mt-8 max-w-4xl rounded-3xl p-3 sm:mt-10 sm:rounded-[26px] sm:p-4">
          <label htmlFor="practice-topic" className="sr-only">Search a coding topic</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input id="practice-topic" value={topic} onChange={(event) => { setTopic(event.target.value); if (error) setError(""); }} placeholder="Search a topic (e.g. binary trees, React, SQL)…" className="field h-14 pl-10! pr-4 text-sm sm:h-14.5" />
            </div>
            <div className="flex gap-3">
              <label className="relative min-w-0 flex-1 sm:w-36 sm:flex-none">
                <span className="sr-only">Question difficulty</span>
                <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty)} className="field h-14 appearance-none pr-10 text-sm sm:h-14.5">
                  <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
              </label>
              <button type="submit" disabled={loadingResults} className="primary-button h-14 shrink-0 px-5 sm:h-14.5 sm:px-7">{loadingResults ? <LoaderCircle size={17} className="animate-spin" /> : <Search size={17} />}{loadingResults ? <span className="hidden sm:inline">Searching</span> : <><span className="hidden sm:inline">Find questions</span><span className="sm:hidden">Search</span></>}</button>
            </div>
          </div>
          {error && <p role="alert" className="px-2 pt-3 text-left text-sm text-rose-200">{error}</p>}
        </form>

        {!searchedTopic && !loadingResults && (
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto mt-5 max-w-4xl overflow-hidden rounded-[26px] border border-[#b7f36b]/15 bg-linear-to-br from-[#b7f36b]/9 via-[#131b22] to-[#17162a] p-6 sm:mt-6 sm:p-9">
            <div className="pointer-events-none absolute -right-10 -top-16 h-60 w-60 rounded-full bg-violet-400/10 blur-[70px]" />
            <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="flex items-center gap-2 text-[#c9ff87]"><span className="grid h-9 w-9 place-items-center rounded-xl border border-[#b7f36b]/15 bg-[#b7f36b]/8"><Sparkles size={17} /></span><span className="eyebrow text-[#c9ff87]!">Your practice starts here</span></div>
                <h2 className="mt-4 max-w-2xl text-2xl font-semibold tracking-[-.035em] text-white sm:text-3xl">Search a topic. Get the questions worth practicing.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Explore a focused set of coding challenges inspired by common interview patterns. Choose a difficulty and work through each problem at your own pace.</p>
                <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full border border-white/8 bg-white/3 px-3 py-1.5 text-xs text-slate-300">Data structures</span><span className="rounded-full border border-white/8 bg-white/3 px-3 py-1.5 text-xs text-slate-300">Algorithms</span><span className="rounded-full border border-white/8 bg-white/3 px-3 py-1.5 text-xs text-slate-300">Interview patterns</span></div>
              </div>
              <div className="hidden h-28 w-28 place-items-center rounded-[28px] border border-white/8 bg-black/20 text-[#c9ff87] sm:grid"><Code2 size={43} strokeWidth={1.25} /></div>
            </div>
            <div className="relative mt-7 border-t border-white/8 pt-5">
              <p className="mb-3 text-xs font-medium text-slate-500">POPULAR STARTING POINTS</p>
              <div className="flex flex-wrap gap-2">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => setTopic(suggestion)} className="rounded-full border border-white/9 bg-white/2.5 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-[#b7f36b]/30 hover:text-white">{suggestion}<ArrowRight size={12} className="ml-2 inline text-slate-500" /></button>)}</div>
            </div>
          </motion.section>
        )}

        {loadingResults && <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-white/[.07] bg-white/2 px-6 py-14 text-center"><LoaderCircle className="mx-auto animate-spin text-[#b7f36b]" size={27} /><p className="mt-4 font-medium text-white">Putting together your practice set…</p><p className="mt-1 text-sm text-slate-500">Finding useful questions for {topic.trim()}.</p></div>}

        {!!searchedTopic && !loadingResults && problems.length > 0 && (
          <section className="mt-8 sm:mt-10">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6"><div><p className="eyebrow">Your practice set</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{searchedTopic}</h2><p className="mt-1.5 text-sm text-slate-500">{problems.length} questions · {difficulty} difficulty</p></div><button type="button" onClick={() => { setSearchedTopic(""); setProblems([]); setError(""); }} className="text-sm font-medium text-slate-400 transition hover:text-white">New search <ArrowRight size={14} className="ml-1 inline" /></button></div>
            <div className="grid gap-4 md:grid-cols-2">
              {problems.map((problem, index) => <motion.article key={`${problem.problem_title}-${index}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .06, .24) }} className="surface flex min-w-0 flex-col rounded-[23px] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#b7f36b]/10 bg-[#b7f36b]/6 text-[#b7f36b]"><Command size={17} /></span><span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${difficultyStyle[problem.problem_level]}`}>{problem.problem_level}</span></div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[.14em] text-slate-600">Question {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-lg font-semibold leading-7 text-white">{problem.problem_title}</h3>
                <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-6 text-slate-400">{problem.problem_desc}</p>
                <div className="mt-5 border-t border-white/[.07] pt-4">
                  <a href={problem.problem_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#b7f36b] transition hover:text-white">
                    Open on {problem.problem_platform_name} <ExternalLink size={14} />
                  </a>
                </div>
              </motion.article>)}
            </div>
            <div className="mt-6 flex items-start gap-2 rounded-2xl border border-white/[.07] bg-white/2.5 p-4 text-sm leading-6 text-slate-400 sm:px-5"><BookOpen size={16} className="mt-1 shrink-0 text-slate-500" />These existing platform problems are selected by AI. If a direct link no longer resolves, the problem may have moved on its platform.</div>
          </section>
        )}
        {!!searchedTopic && !loadingResults && problems.length === 0 && error && <section className="surface mx-auto mt-8 max-w-4xl rounded-3xl px-6 py-12 text-center"><p className="text-lg font-semibold text-white">No practice set yet</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Check the topic and try again. You can also choose one of the popular topics to get started.</p><button type="button" onClick={() => { setSearchedTopic(""); setError(""); }} className="primary-button mt-5">Try another topic <ArrowRight size={15} /></button></section>}
      </div>
    </main>
  );
}
