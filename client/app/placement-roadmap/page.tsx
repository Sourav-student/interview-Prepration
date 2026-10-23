import Link from "next/link";
import { ArrowRight, BookOpen, BriefcaseBusiness, Check, Code2, Compass, GraduationCap, Sparkles } from "lucide-react";

const steps = [
  {
    week: "01",
    title: "Build your foundations",
    copy: "Revisit core concepts in your target domain. Focus on understanding the why behind the tools you use.", icon: BookOpen,
    tag: "FOUNDATION",
    color: "text-violet-200 bg-violet-300/10"
  },
  {
    week: "02",
    title: "Practice with intention",
    copy: "Solve problems by topic, explain your thinking out loud, and keep notes on patterns you notice.",
    icon: Code2,
    tag: "SKILL BUILDING",
    color: "text-cyan-200 bg-cyan-300/10"
  },
  {
    week: "03",
    title: "Get comfortable in the room",
    copy: "Try realistic mock interviews. Practice clear communication, thoughtful pauses, and follow-up questions.",
    icon: Compass,
    tag: "INTERVIEW READY", color: "text-[#b7f36b] bg-[#b7f36b]/10"
  },
  {
    week: "04",
    title: "Tell your story", copy: "Connect your projects and experiences to the role. Prepare examples that show how you think and learn.", icon: BriefcaseBusiness,
    tag: "YOUR STORY",
    color: "text-amber-200 bg-amber-300/10"
  },
];

export default function PlacementRoadmap() {
  return (
    <main className="page-shell px-5 pb-20 sm:px-8">
      <div className="mx-auto max-w-6xl pt-10">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">A path that moves with you</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-[-.05em] text-white sm:text-5xl">Make your next move <span className="text-gradient">feel clearer.</span></h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">There’s no single route to a great opportunity. Use this flexible roadmap to focus your effort, find your rhythm, and keep going.</p>
          </div>
          <Link href="/placement-predict" className="secondary-button w-fit">
            <GraduationCap size={17} /> Check your readiness
          </Link>
        </div>
        <section className="surface relative mt-10 overflow-hidden rounded-[28px] p-6 sm:p-9">
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-violet-300/6 blur-[90px]" />
          <div className="relative flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/8 bg-white/3 text-[#b7f36b]"><Sparkles size={18} /></span>
            <div>
              <h2 className="font-semibold text-white">Your four-week momentum map</h2>
              <p className="mt-1 text-xs text-slate-500">Start where you are. Repeat what helps. Skip ahead when you're ready.</p>
            </div>
          </div>
          <div className="relative mt-9 grid gap-4 md:grid-cols-2">{steps.map((step, i) => <article key={step.week} className="group relative rounded-2xl border border-white/[.07] bg-[#0a0f15]/65 p-5 transition hover:border-white/[.14]">
            <div className="flex items-start justify-between">
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${step.color}`}><step.icon size={19} /></span>
              <span className="font-mono text-xs text-slate-700">WEEK {step.week}</span>
            </div>
            <p className="mt-5 text-[10px] font-bold tracking-[.16em] text-slate-600">{step.tag}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{step.copy}</p>
            <span className="absolute bottom-5 right-5 hidden text-[#b7f36b]/70 transition group-hover:block"><Check size={16} />
            </span>
          </article>)}</div>
        </section>
        <div className="mt-6 flex flex-col justify-between gap-4 rounded-3xl border border-white/[.07] bg-white/2.5 p-6 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="font-semibold text-white">Turn a plan into practice.</p>
            <p className="mt-1 text-sm text-slate-500">Pick a small next step and start whenever you're ready.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/study-planner" className="secondary-button">Open study planner <ArrowRight size={15} /></Link>
            <Link href="/interview" className="primary-button">Practice an interview <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
