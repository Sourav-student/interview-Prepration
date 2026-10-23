"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowRight, ArrowUpRight, AudioLines, BrainCircuit, Check, ChevronRight, CirclePlay, Code2, Flame, Gauge, Library, Sparkles, Target, TrendingUp, Trophy, Zap } from "lucide-react";
import { useAuth } from "@/AuthContext";

const tools = [
  { icon: AudioLines, number: "01", title: "Mock interviews", detail: "Build confidence through realistic, AI-led conversations tailored to your role.", href: "/interview", label: "Practice out loud", tint: "from-violet-400/20 to-fuchsia-400/5" },
  { icon: Code2, number: "02", title: "Practice problems", detail: "Turn the topics you struggle with into focused, bite-sized practice.", href: "/problems", label: "Find your edge", tint: "from-cyan-400/20 to-blue-400/5" },
  { icon: Library, number: "03", title: "DSA sheet library", detail: "Explore structured problem lists from different authors and find a plan that fits you.", href: "/dsa-sheets", label: "Browse the library", tint: "from-cyan-400/20 to-indigo-400/5" },
  { icon: Target, number: "04", title: "Placement outlook", detail: "See how your current profile maps to placement readiness and what to improve.", href: "/placement-predict", label: "Know your position", tint: "from-[#b7f36b]/20 to-emerald-400/5" },
];

const rise = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: .65, ease: "easeOut" as const } } };

export default function Home() {
  const { user } = useAuth();
  return <main className="overflow-hidden">
    <section className="relative mx-auto flex min-h-[700px] max-w-7xl items-center px-5 pb-16 pt-28 sm:px-8 lg:min-h-[780px]">
      <div className="grid-glow pointer-events-none absolute inset-x-0 top-0 h-[650px] opacity-40" />
      <div className="pointer-events-none absolute left-[55%] top-[10%] h-[540px] w-[540px] rounded-full bg-[#a6e95f]/[.045] blur-[100px]" />
      <div className="relative z-10 grid w-full items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: .12 } } }} className="max-w-[650px]">
          <motion.div variants={rise} className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#b7f36b]/15 bg-[#b7f36b]/[.06] px-3.5 py-2 text-xs font-semibold text-[#d3f4ad]"><span className="relative flex h-2 w-2"><span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#b7f36b]" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#b7f36b]" /></span> YOUR NEXT CHAPTER STARTS HERE</motion.div>
          <motion.h1 variants={rise} className="text-[3.35rem] font-semibold leading-[.99] tracking-[-.065em] text-white sm:text-7xl lg:text-[5.7rem]">Build your skills.<br /><span className="text-gradient">Find your next step.</span></motion.h1>
          <motion.p variants={rise} className="mt-7 max-w-[510px] text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">One place to learn, practice, and plan what comes next. Explore focused problem sets, AI-powered interview practice, and tools to help you keep growing.</motion.p>
          <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-3">
            <Link href={user ? "/dashboard" : "/signup"} className="primary-button group">{user ? "Go to your dashboard" : "Get started free"}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
            <Link href="#tools" className="secondary-button"><CirclePlay size={17} /> Explore the platform</Link>
          </motion.div>
          <motion.div variants={rise} className="mt-10 flex items-center gap-4 text-xs text-slate-500"><div className="flex -space-x-2"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#090d13] bg-violet-300/20 text-violet-200">S</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#090d13] bg-cyan-300/20 text-cyan-200">D</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#090d13] bg-orange-300/20 text-orange-200">A</span></div><span><strong className="font-semibold text-slate-300">A little practice goes a long way.</strong><br />Your future self is already cheering.</span></motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: .94, x: 24 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: .8, delay: .25, ease: "easeOut" }} className="relative mx-auto w-full max-w-[510px] lg:ml-auto">
          <div className="float-slow relative">
            <div className="absolute -inset-10 rounded-[40%] bg-gradient-to-br from-[#b7f36b]/10 via-cyan-300/[.05] to-violet-300/[.08] blur-3xl" />
            <div className="surface relative overflow-hidden rounded-[30px] p-5 sm:p-7">
              <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-[#b7f36b]/[.06] blur-3xl" />
              <div className="relative flex items-center justify-between"><div><p className="text-xs font-medium text-slate-500">YOUR PREP SPACE</p><p className="mt-1 text-lg font-semibold text-white">A little better, every day.</p></div><span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#b7f36b]/15 bg-[#b7f36b]/[.08] text-[#b7f36b]"><Sparkles size={18} /></span></div>
              <div className="relative mt-7 rounded-2xl border border-white/[.07] bg-[#0a0f15]/80 p-5">
                <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-300">Weekly momentum</span><span className="flex items-center gap-1 text-xs font-semibold text-[#b7f36b]"><TrendingUp size={14} /> On track</span></div>
                <div className="mt-6 flex h-28 items-end gap-2.5 sm:gap-3">{[35, 54, 43, 72, 53, 88, 68, 100, 77, 91, 65, 85, 70, 96].map((h, i) => <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: .7, delay: .5 + i * .035, ease: "easeOut" }} className={`flex-1 rounded-t-md ${i === 13 ? "bg-[#b7f36b] shadow-[0_0_18px_rgba(183,243,107,.22)]" : "bg-gradient-to-t from-[#536b40]/50 to-[#b7f36b]/50"}`} />)}</div>
                <div className="mt-3 flex justify-between text-[10px] text-slate-600"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>TODAY</span></div>
              </div>
              <div className="relative mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/[.07] bg-white/[.025] p-4"><span className="flex items-center gap-2 text-xs text-slate-500"><Flame size={14} className="text-orange-300" /> CONSISTENCY</span><p className="mt-3 text-2xl font-semibold text-white">Keep it up<span className="text-[#b7f36b]">.</span></p><p className="mt-1 text-xs text-slate-500">Every session counts</p></div>
                <div className="rounded-2xl border border-white/[.07] bg-white/[.025] p-4"><span className="flex items-center gap-2 text-xs text-slate-500"><Gauge size={14} className="text-cyan-300" /> YOUR NEXT STEP</span><p className="mt-3 text-sm font-semibold text-white">Try a mock interview</p><Link href="/interview" className="mt-2 inline-flex items-center gap-1 text-xs text-[#b7f36b]">Start a session <ArrowUpRight size={12} /></Link></div>
              </div>
              <div className="relative mt-3 flex items-center gap-3 rounded-2xl border border-white/[.07] bg-white/[.025] p-4"><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-300/10 text-violet-200"><BrainCircuit size={18} /></span><div className="flex-1"><p className="text-sm font-medium text-white">Progress, made personal</p><p className="mt-0.5 text-xs text-slate-500">A plan that moves at your pace</p></div><ChevronRight size={16} className="text-slate-600" /></div>
            </div>
          </div>
          <motion.div animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }} transition={{ duration: 5, repeat: Infinity }} className="surface absolute -left-8 top-[30%] hidden items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl sm:flex"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#b7f36b]/10 text-[#b7f36b]"><Zap size={17} /></span><div><p className="text-xs font-semibold text-white">Ready when you are</p><p className="mt-0.5 text-[10px] text-slate-500">One step at a time</p></div></motion.div>
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: .5 }} className="surface absolute -right-3 bottom-[15%] hidden items-center gap-2.5 rounded-2xl px-4 py-3 shadow-2xl sm:flex"><Trophy size={18} className="text-amber-300" /><span className="text-xs font-semibold text-white">Progress you can feel</span><Check size={14} className="text-[#b7f36b]" /></motion.div>
        </motion.div>
      </div>
      <Link href="#tools" aria-label="Scroll to platform features" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs text-slate-600 transition hover:text-slate-300 md:flex">SCROLL TO EXPLORE <ArrowDownRight size={14} /></Link>
    </section>

    <section id="tools" className="relative border-t border-white/[.06] bg-white/[.012] px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: .3 }} variants={{ visible: { transition: { staggerChildren: .12 } } }} className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <motion.div variants={rise}><p className="eyebrow">A smarter way to prepare</p><h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-.045em] text-white sm:text-5xl">Everything you need to <span className="text-gradient">feel ready.</span></h2></motion.div>
          <motion.p variants={rise} className="max-w-sm pb-1 text-sm leading-6 text-slate-500">No guesswork. Just thoughtful tools that help you build real interview confidence at your own pace.</motion.p>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tools.map(({ icon: Icon, number, title, detail, href, label, tint }, i) => <motion.div key={title} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .55, delay: i * .1 }} whileHover={{ y: -5 }} className="group relative overflow-hidden rounded-[24px] border border-white/[.08] bg-[#10161e] p-6 transition-colors hover:border-white/[.15] sm:p-7"><div className={`pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${tint} blur-2xl transition-transform duration-500 group-hover:scale-125`} /><div className="relative flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/[.08] bg-white/[.035] text-white"><Icon size={21} /></span><span className="font-mono text-xs text-slate-700">{number}</span></div><h3 className="relative mt-8 text-xl font-semibold text-white">{title}</h3><p className="relative mt-3 min-h-[54px] text-sm leading-6 text-slate-500">{detail}</p><Link href={href} className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition group-hover:text-[#b7f36b]">{label}<ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link></motion.div>)}
        </div>
      </div>
    </section>

    <section className="px-5 py-20 sm:px-8 sm:py-28"><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] border border-white/[.08] bg-[#111922] px-7 py-14 text-center sm:px-14 sm:py-20"><div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[600px] -translate-x-1/2 rounded-full bg-[#b7f36b]/[.08] blur-[90px]" /><div className="relative"><span className="eyebrow">Your pace. Your potential.</span><h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-[-.045em] text-white sm:text-5xl">The opportunity is yours.<br /><span className="text-gradient">Let&apos;s get you ready.</span></h2><p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-slate-400">Your next interview can feel different. Take the first step and build the confidence that stays with you.</p><Link href={user ? "/dashboard" : "/signup"} className="primary-button mt-8">{user ? "Continue your prep" : "Create your free account"}<ArrowRight size={16} /></Link></div></motion.div></section>
  </main>;
}
