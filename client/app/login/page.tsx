"use client";
import axios from "axios";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Sparkles } from "lucide-react";
import { useAuth } from "@/AuthContext";
import { toast } from "react-hot-toast";

export default function Login() {
  const { getUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, formData, { timeout: 10000, withCredentials: true });
      await getUser(); toast.success(res.data.message || "Welcome back!"); router.push("/dashboard");
    } catch (error) { toast.error(axios.isAxiosError(error) ? error.response?.data?.message || "We couldn’t sign you in. Try again." : "Something went wrong. Try again."); }
    finally { setLoading(false); }
  };
  return <main className="page-shell relative flex items-center justify-center overflow-hidden px-5 py-14 sm:px-8"><div className="pointer-events-none absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-violet-400/[.07] blur-[90px]" /><div className="pointer-events-none absolute bottom-[10%] right-[8%] h-80 w-80 rounded-full bg-[#b7f36b]/[.055] blur-[90px]" />
    <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/[.09] bg-[#10161e] shadow-2xl shadow-black/30 md:grid-cols-[.95fr_1.05fr]">
      <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative hidden min-h-[550px] flex-col justify-between overflow-hidden border-r border-white/[.07] bg-[#0d131a] p-10 md:flex"><div className="grid-glow absolute inset-0 opacity-60" /><div className="relative"><span className="eyebrow">A little practice changes everything</span><h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-.05em] text-white">You&apos;re closer<br />than you think<span className="text-[#b7f36b]">.</span></h2><p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">Pick up where you left off. Your next breakthrough might be one practice session away.</p></div><div className="surface relative rounded-2xl p-5"><Sparkles size={18} className="text-[#b7f36b]" /><p className="mt-3 text-sm leading-6 text-slate-300">“Confidence comes from preparation. Every small step forward is still progress.”</p><p className="mt-4 text-xs text-slate-600">YOUR PREPTRACK SPACE</p></div><span className="eyebrow relative">PREPARE WITH PURPOSE · GROW WITH CONFIDENCE</span></motion.aside>
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="p-7 sm:p-10 md:p-12"><div className="mb-8 md:mb-10"><span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#b7f36b]/20 bg-[#b7f36b]/[.08] font-black text-[#b7f36b]">P.</span><p className="eyebrow mt-7">Welcome back</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] text-white">Good to see you again.</h1><p className="mt-2 text-sm text-slate-500">Sign in and keep your momentum going.</p></div>
        <form onSubmit={handleSubmit} className="space-y-5"><div><label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-300">Username</label><input id="username" autoComplete="username" className="field" placeholder="Your username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required /></div><div><label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">Password</label><div className="relative"><input id="password" autoComplete="current-password" className="field pr-12" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div><button type="submit" disabled={loading} className="primary-button mt-2 w-full disabled:cursor-wait disabled:opacity-60">{loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Signing in…</> : <>Sign in to SkillSpring <ArrowRight size={16} /></>}</button></form>
        <div className="my-7 flex items-center gap-4"><span className="h-px flex-1 bg-white/[.08]" /><span className="text-[10px] font-semibold tracking-[.18em] text-slate-600">YOUR NEXT STEP</span><span className="h-px flex-1 bg-white/[.08]" /></div><p className="text-center text-sm text-slate-500">New to SkillSpring? <Link href="/signup" className="font-semibold text-[#b7f36b] hover:text-white">Create an account</Link></p><p className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-600"><LockKeyhole size={13} /> Your progress is yours. Always.</p>
      </motion.section>
    </div>
  </main>;
}
