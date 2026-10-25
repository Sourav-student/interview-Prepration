"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Code2, MessageSquareText, TrendingUp } from "lucide-react";

type UserStats = {
  id: string;
  name: string;
  email: string;
  streak?: string;
  mock_interviews?: string;
  problems_solved?: string;
};

export default function StatsGrid(user: UserStats) {
  const stats = [
    {
      label: "Mock interviews",
      value: user.mock_interviews || "0",
      note: "sessions completed",
      icon: MessageSquareText,
      color: "violet",
    },
    {
      label: "Questions solved",
      value: user.problems_solved || "0",
      note: "problems practiced",
      icon: Code2,
      color: "cyan",
    },
    {
      label: "Current streak",
      value: user.streak || "0",
      note: "days in a row",
      icon: TrendingUp,
      color: "lime",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45 }}
      className="mt-10"
      aria-labelledby="progress-title"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Your progress</p>
          <h2 id="progress-title" className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Consistency looks good on you.
          </h2>
        </div>
        <Link href="/dashboard/feedbacks" className="secondary-button rounded-xl! px-4! py-2.5! text-sm">
          View interview feedback <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map(({ label, value, note, icon: Icon, color }, index) => (
          <motion.article
            key={label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: index * 0.07 }}
            className="dashboard-stat rounded-[22px] border p-5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-400">{label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{note}</p>
              </div>
              <span className={`dashboard-action-icon dashboard-action-icon-${color} grid h-10 w-10 place-items-center rounded-xl`}>
                <Icon size={18} />
              </span>
            </div>
          </motion.article>
        ))}
      </div>

      <Link
        href="/interview"
        className="dashboard-continue group mt-4 flex flex-col gap-4 rounded-[22px] border p-5 transition hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <span className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#b7f36b]/10 text-[#83b746]">
            <TrendingUp size={18} />
          </span>
          <span>
            <span className="block font-semibold text-white">One more practice session?</span>
            <span className="mt-1 block text-sm text-slate-400">Build confidence by showing up for the next question.</span>
          </span>
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#83b746]">
          Continue practicing <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </Link>
    </motion.section>
  );
}
