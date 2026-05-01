"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Define navigation links outside the component to prevent recreation on renders
const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Interview", href: "/interview" },
  { name: "Problems", href: "/problems" },
];

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [openNavbar, setOpenNavbar] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpenNavbar(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full fixed top-0 left-0 z-50 bg-black/60 backdrop-blur-md border-b border-gray-800 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-2 sm:px-4 py-1 sm:py-2">

        {/* Logo */}
        <Link
          href="/"
          className="tracking-tight hover:opacity-80 transition-opacity flex justify-center gap-1"
        >
          <Image src="/prepTrack.png" width={30} height={30} alt="logo"></Image>
          <p className="text-xl hidden sm:block sm:text-2xl font-bold text-white">PrepTrack</p>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-medium transition-colors duration-200 py-1 ${isActive
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                {link.name}
                {/* Active Indicator Underline */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 right-0 -bottom-1 h-0.5 bg-blue-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Auth Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {!loading && (
              user ? (
                <div className="py-2 px-4 text-sm font-medium text-gray-300 border border-gray-700 rounded-2xl hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-gray-600">
                  Streak : {user.streak}
                </div>
              ) : (
                <Link href="/login">
                  <button className="py-2 px-4 text-sm font-medium text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-800 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-gray-600">
                    Login
                  </button>
                </Link>
              )
            )}

            {!user && !loading && (
              <Link href="/login">
                <button className="py-2 px-5 text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black">
                  Get Started
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
            onClick={() => setOpenNavbar(!openNavbar)}
            aria-expanded={openNavbar}
            aria-label="Toggle navigation menu"
          >
            <AnimatePresence mode="wait">
              {openNavbar ? (
                <motion.svg
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {openNavbar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-gray-800 bg-black/95 backdrop-blur-lg overflow-hidden"
          >
            <nav className="flex flex-col px-4 pt-2 pb-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Mobile Auth Buttons */}
              <div className="pt-4 pb-2 border-t border-gray-800 flex flex-col gap-2 sm:hidden">
                {!loading && user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:bg-gray-800 hover:text-white">
                      Login
                    </Link>
                    <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 text-center mt-2">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;