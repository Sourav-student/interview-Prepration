"use client";

import React, { useEffect } from "react";
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
      <div className="flex justify-end">
        <button
          className="border border-white rounded-lg px-4 py-2 hover:bg-blue-950 cursor-pointer"
          onClick={async () => await logout()}>
          Logout
        </button>
      </div>
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
          <Link href="/problems">
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black">
              Start Practicing
            </button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <StatsGrid {...user} />
      </motion.div>
      <UserFeedback />
      <div className="flex justify-end">
        <button
          className="border mt-3 border-white rounded-lg px-4 py-2 hover:bg-blue-950 cursor-pointer"
          onClick={async () => router.push('/dashboard/feedbacks')}>
          View Feedbacks
        </button>
      </div>
    </div>
  );
};

export default Dashboard;