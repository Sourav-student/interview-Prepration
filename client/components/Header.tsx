"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Flame, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { name: "Overview", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Mock interview", href: "/interview" },
  { name: "Practice", href: "/problems" },
  { name: "DSA sheets", href: "/dsa-sheets" },
  { name: "Placement AI", href: "/placement-predict" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <motion.header initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .5, ease: "easeOut" }} className="fixed inset-x-0 top-0 z-50 border-b border-white/[.07] bg-[#090d13]/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="SkillSpring home">
          <span className="relative grid h-10 w-10 place-items-center rounded-2xl border border-[#b7f36b]/25 bg-[#b7f36b]/10 text-[#b7f36b] transition group-hover:rotate-[-8deg] group-hover:bg-[#b7f36b]/15">
            <span className="text-lg font-black tracking-tighter">S<span className="text-white">.</span></span>
          </span>
          <span className="text-[17px] font-bold tracking-tight text-white">skill<span className="text-[#b7f36b]">spring</span></span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return <Link key={item.name} href={item.href} className={`relative rounded-full px-3.5 py-2 text-[13px] font-medium transition ${active ? "text-white" : "text-slate-400 hover:text-white"}`}>
              {item.name}{active && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full border border-white/[.08] bg-white/[.06]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            </Link>;
          })}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          {loading ? <span className="h-9 w-24 animate-pulse rounded-full bg-white/[.06]" /> : user ? <>
            <span className="hidden items-center gap-1.5 rounded-full border border-orange-300/15 bg-orange-300/[.06] px-3 py-2 text-xs font-semibold text-orange-200 md:flex"><Flame size={14} />{user.streak || 0} day streak</span>
            <button onClick={handleLogout} className="text-sm text-slate-400 transition hover:text-white">Log out</button>
            <Link href="/dashboard" className="grid h-9 w-9 place-items-center rounded-full bg-[#b7f36b] text-sm font-bold text-[#17200f]">{(user.name || user.email || "P").slice(0, 1).toUpperCase()}</Link>
          </> : <>
            <Link href="/login" className="px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white">Log in</Link>
            <Link href="/signup" className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-[#10150e] transition hover:bg-[#b7f36b]">Get started <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
          </>}
        </div>

        <button onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white sm:hidden">{open ? <X size={19} /> : <Menu size={19} />}</button>
      </div>
      <AnimatePresence>
        {open && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-white/[.07] bg-[#090d13] sm:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-3" aria-label="Mobile navigation">
            {NAV_LINKS.map((item) => <Link key={item.name} href={item.href} className={`rounded-xl px-4 py-3 text-sm ${pathname === item.href ? "bg-white/[.07] text-white" : "text-slate-400"}`}>{item.name}</Link>)}
            {!loading && (user ? <button onClick={handleLogout} className="mt-2 rounded-xl px-4 py-3 text-left text-sm text-slate-400">Log out</button> : <div className="grid grid-cols-2 gap-3 border-t border-white/[.08] pt-4"><Link href="/login" className="secondary-button">Log in</Link><Link href="/signup" className="primary-button">Get started</Link></div>)}
          </nav>
        </motion.div>}
      </AnimatePresence>
    </motion.header>
  );
}
