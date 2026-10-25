"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, BookOpen, Brain, Code2, Flame, Map, Sparkles,
} from "lucide-react";
import { useAuth } from "@/AuthContext";
import StatsGrid from "@/components/UI/StatsGrid";

const quickActions = [
  {
    title: "Study planner",
    detail: "Turn your goals into a focused weekly plan.",
    href: "/study-planner",
    icon: BookOpen,
    tone: "violet",
  },
  {
    title: "Placement roadmap",
    detail: "See the next steps on your path to placement.",
    href: "/placement-roadmap",
    icon: Map,
    tone: "cyan",
  },
  {
    title: "Practice problems",
    detail: "Build confidence one question at a time.",
    href: "/practices",
    icon: Code2,
    tone: "lime",
  },
  {
    title: "Skill insights",
    detail: "Discover strengths and topics to work on.",
    href: "/weekness-detection",
    icon: Brain,
    tone: "amber",
  },
];

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const firstName = user?.name?.trim().split(/\s+/)[0] || user?.email?.split("@")[0] || "there";

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="page-shell px-5 py-12 sm:px-8" aria-label="Loading dashboard">
        <div className="mx-auto max-w-7xl animate-pulse" aria-hidden="true">
          <div className="h-3 w-32 rounded-full bg-white/10" />
          <div className="mt-5 h-10 max-w-sm rounded-xl bg-white/[.08]" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-36 rounded-3xl border border-white/[.08] bg-white/[.025]" />
            ))}
          </div>
        </div>
        <span className="sr-only" role="status">Loading your dashboard…</span>
      </main>
    );
  }

  return (
    <main className="page-shell px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto max-w-7xl"
      >
        <section className="surface relative overflow-hidden rounded-[30px] p-6 sm:p-9 lg:p-11">
          <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#b7f36b]/[.09] blur-[90px]" />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow inline-flex items-center gap-2">
                <Sparkles size={14} /> Your learning space
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-.045em] text-white sm:text-4xl lg:text-5xl">
                Welcome back, {firstName}.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Small, steady steps add up. Pick up where you left off or choose a new focus for today.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/interview" className="primary-button group">
                  Start a mock interview
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/dsa-sheets" className="secondary-button">
                  Browse DSA sheets <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              className="flex w-fit items-center gap-3 rounded-2xl border border-orange-300/15 bg-orange-300/[.06] px-4 py-3"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-300/10 text-orange-500">
                <Flame size={20} />
              </span>
              <span>
                <span className="block text-lg font-semibold leading-5 text-white">{user.streak || 0} days</span>
                <span className="mt-1 block text-xs text-slate-400">current streak</span>
              </span>
            </motion.div>
          </div>
        </section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } } }}
          className="mt-10"
          aria-labelledby="quick-actions-title"
        >
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Make today count</p>
              <h2 id="quick-actions-title" className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Your next steps
              </h2>
            </div>
            <p className="text-sm text-slate-500">Choose a path and keep your momentum.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map(({ title, detail, href, icon: Icon, tone }) => (
              <motion.div
                key={href}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
                }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={href}
                  className="dashboard-action group flex h-full min-h-48 flex-col rounded-[24px] border p-5 transition-colors sm:p-6"
                >
                  <span className={`dashboard-action-icon dashboard-action-icon-${tone} grid h-11 w-11 place-items-center rounded-2xl`}>
                    <Icon size={20} />
                  </span>
                  <span className="mt-6 flex items-center justify-between gap-3">
                    <span className="text-base font-semibold text-white">{title}</span>
                    <ArrowUpRight size={16} className="shrink-0 text-slate-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#b7f36b]" />
                  </span>
                  <span className="mt-2 text-sm leading-5 text-slate-400">{detail}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <StatsGrid {...user} />

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={async () => {
              if (await logout()) router.push("/login");
            }}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-white/[.05] hover:text-white"
          >
            Sign out
          </button>
        </div>
      </motion.div>
    </main>
  );
}
