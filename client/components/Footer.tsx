"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

// 1. Define TypeScript Interfaces
interface FooterLink {
  name: string;
  href: string;
}

// 2. Extract Data for Cleaner JSX
const QUICK_LINKS: FooterLink[] = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Interview", href: "/interview" },
  { name: "Problems", href: "/problems" },
];

const SUPPORT_LINKS: FooterLink[] = [
  { name: "Help & FAQs", href: "/" },
  { name: "Contact Us", href: "/" },
  { name: "Platform Status", href: "/" },
  { name: "Resources", href: "/" },
];

const COMPANY_LINKS: FooterLink[] = [
  { name: "Blogs", href: "/" },
  { name: "Policies", href: "/" },
  { name: "About Us", href: "/aboutus" },
  { name: "Careers", href: "/" },
];

// 3. Define Framer Motion Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, 
      delayChildren: 0.2,
    },
  },
};

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as const, stiffness: 50, damping: 15 } 
  },
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-linear-to-tr from-gray-950 via-gray-900 to-black text-gray-400 border-t border-gray-800 overflow-hidden">
      
      {/* Viewport trigger for animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto px-6 py-8 md:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-6"
      >
        
        {/* Brand Section */}
        <motion.div variants={columnVariants} className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3 w-fit group">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
              <Image 
                src="/prepTrack.png" 
                alt="PrepTrack Logo" 
                className="rounded-full shadow-lg" 
                height={45} 
                width={45} 
              />
            </motion.div>
            <h2 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
              PrepTrack
            </h2>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            PrepTrack is a platform that gives you the experience and practice needed for your upcoming interviews.
          </p>
        </motion.div>

        {/* Quick Links Section */}
        <motion.div variants={columnVariants} className="flex flex-col gap-3 md:pl-8">
          <p className="font-semibold text-white tracking-wide mb-2">Quick Links</p>
          <ul className="flex flex-col gap-3 text-sm">
            {QUICK_LINKS.map((link) => (
              <motion.li key={link.name} whileHover={{ x: 5 }}>
                <Link href={link.href} className="hover:text-blue-400 transition-colors duration-200">
                  {link.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Support Section */}
        <motion.div variants={columnVariants} className="flex flex-col gap-3">
          <p className="font-semibold text-white tracking-wide mb-2">Support</p>
          <ul className="flex flex-col gap-3 text-sm">
            {SUPPORT_LINKS.map((link) => (
              <motion.li key={link.name} whileHover={{ x: 5 }}>
                <Link href={link.href} className="hover:text-blue-400 transition-colors duration-200">
                  {link.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Company Section */}
        <motion.div variants={columnVariants} className="flex flex-col gap-3">
          <p className="font-semibold text-white tracking-wide mb-2">Company</p>
          <ul className="flex flex-col gap-3 text-sm">
            {COMPANY_LINKS.map((link) => (
              <motion.li key={link.name} whileHover={{ x: 5 }}>
                <Link href={link.href} className="hover:text-blue-400 transition-colors duration-200">
                  {link.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

      </motion.div>

      {/* Bottom Copyright Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="border-t border-gray-800/60"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm">
          <p>All rights reserved © {currentYear}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </motion.div>

    </footer>
  );
};

export default Footer;