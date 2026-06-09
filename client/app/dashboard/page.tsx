"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/AuthContext";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import StatsGrid from "@/components/UI/StatsGrid";
import UserFeedback from "@/components/UI/UserFeedback";

// 3. Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

const Dashboard: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [nav_links] = useState([
     {name: "Planner", href: "/study-planner"} ,
     {name: "Roadmap", href: "/placement-roadmap"},
     {name: "Weakness", href: "/weakness-detection"},
     {name: "Problems", href: "/problems"},
  ]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Clean Loading State
  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center bg-black">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="h-8 w-32 bg-gray-800 rounded-md mb-8"
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-7xl">
          {Array(4).map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
              className="h-32 bg-gray-900 rounded-xl border border-gray-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black pt-18 pb-12 px-4 sm:px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.name || user?.email?.split('@') || "User"}! 👋
            </h1>
            <p className="text-gray-400 mt-1">Ready to crush your next interview?</p>
          </div>
          <button
            className="border border-white rounded-lg px-4 py-2 hover:bg-blue-950 cursor-pointer"
            onClick={async () => await logout()}>
            Logout
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-2 flex-wrap justify-around items-center border rounded-xl py-4 px-6 border-zinc-800 bg-zinc-950">
            {
              nav_links.map((link, index) => (
                <Link href={link.href} key={index} className="py-2 px-4 font-medium hover:bg-zinc-800 rounded-xl text-xl bg-black border border-zinc-900">{link.name}</Link>
              ))
            }
        </motion.div>
      </motion.div>
      <StatsGrid {...user} />
    </div>
  );
};

export default Dashboard;