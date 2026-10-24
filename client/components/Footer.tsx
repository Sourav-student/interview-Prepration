import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

const links = [{ label: "Dashboard", href: "/dashboard" }, { label: "Mock interviews", href: "/interview" }, { label: "Practice problems", href: "/practices" }, { label: "DSA sheets", href: "/dsa-sheets" }, { label: "About SkillSpring", href: "/aboutus" }];

export default function Footer() {
  return <footer className="border-t border-white/[.06] bg-[#080b10] px-5 py-8 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center"><div><Link href="/" className="inline-flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-xl border border-[#b7f36b]/20 bg-[#b7f36b]/[.08] text-xs font-black text-[#b7f36b]">S.</span><span className="font-semibold text-slate-200">skill<span className="text-[#b7f36b]">spring</span></span></Link><p className="mt-2 text-xs text-slate-600">Tools for learning, practice, and career growth.</p></div><nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Footer navigation">{links.map((link) => <Link href={link.href} key={link.href} className="text-xs text-slate-500 transition hover:text-white">{link.label}</Link>)}</nav><p className="flex items-center gap-1.5 text-xs text-slate-600"><Sparkles size={12} className="text-[#b7f36b]/70" /> Built for your next step <ArrowUpRight size={12} /></p></div><div className="mx-auto mt-7 max-w-7xl border-t border-white/[.05] pt-5 text-[11px] text-slate-700">© {new Date().getFullYear()} SkillSpring. Keep moving forward.</div></footer>;
}
