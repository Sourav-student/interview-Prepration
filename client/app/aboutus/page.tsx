import Link from "next/link";
import { ArrowRight, BrainCircuit, Compass, Library, Sparkles } from "lucide-react";

const pillars = [
  { icon: BrainCircuit, title: "Learn with direction", copy: "Turn a big goal into clear next steps with a study plan and a flexible roadmap." },
  { icon: Library, title: "Practice your way", copy: "Explore DSA sheets from different authors, generate topic-based problems, and try AI mock interviews." },
  { icon: Compass, title: "Keep finding your next step", copy: "Use progress and placement insights to decide what to focus on as your goals change." },
];

export default function AboutUs() {
  return <main className="page-shell px-5 pb-20 sm:px-8"><div className="mx-auto max-w-6xl pt-12"><p className="eyebrow">About the platform</p><h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-.05em] text-white sm:text-6xl">A practical space to <span className="text-gradient">learn, grow, and move forward.</span></h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">SkillSpring brings learning, structured practice, planning, and career-readiness tools together, so you can build skills at your own pace and shape your own path.</p><div className="mt-10 grid gap-4 md:grid-cols-3">{pillars.map(({ icon: Icon, title, copy }) => <article key={title} className="surface rounded-[24px] p-6"><span className="grid h-11 w-11 place-items-center rounded-xl border border-[#b7f36b]/10 bg-[#b7f36b]/[.06] text-[#b7f36b]"><Icon size={20} /></span><h2 className="mt-5 text-lg font-semibold text-white">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p></article>)}</div><div className="mt-5 flex flex-col justify-between gap-4 rounded-[24px] border border-white/[.07] bg-white/[.025] p-6 sm:flex-row sm:items-center sm:px-8"><div><p className="flex items-center gap-2 font-semibold text-white"><Sparkles size={16} className="text-[#b7f36b]" /> Your next step starts wherever you are.</p><p className="mt-1 text-sm text-slate-500">Choose a tool and keep building from there.</p></div><Link href="/dsa-sheets" className="secondary-button w-fit">Explore DSA sheets <ArrowRight size={15} /></Link></div></div></main>;
}
