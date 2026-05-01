import React from 'react'
import { motion, Variants } from "framer-motion";

type User = {
  id: string;
  name: string;
  email: string;
  streak?: string;
  mock_interviews?: string,
  problems_solved?: string
};


const StatsGrid = (user : User) => {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {/* Problems Solved Card */}
      <motion.div
        whileHover={{ y: -4 }}
        className="p-6 bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-2xl hover:border-blue-500/50 hover:bg-gray-800/60 transition-all duration-300 group"
      >
        <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Problems Solved
        </p>
        <p className="mt-4 text-3xl sm:text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">
          {user?.problems_solved || 0}
        </p>
      </motion.div>
      {/* Mock Interviews Card */}
      <motion.div
        whileHover={{ y: -4 }}
        className="p-6 bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-2xl hover:border-purple-500/50 hover:bg-gray-800/60 transition-all duration-300 group"
      >
        <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Mock Interviews
        </p>
        <p className="mt-4 text-3xl sm:text-4xl font-bold text-white group-hover:text-purple-400 transition-colors">
          {user?.mock_interviews || 0}
        </p>
      </motion.div>
      {/* Streak Card */}
      <motion.div
        whileHover={{ y: -4 }}
        className="p-6 bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-2xl hover:border-orange-500/50 hover:bg-gray-800/60 transition-all duration-300 group"
      >
        <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
          Current Streak
        </p>
        <p className="mt-4 text-3xl sm:text-4xl font-bold text-white group-hover:text-orange-400 transition-colors">
          {user?.streak || 0} <span className="text-lg text-gray-500 font-medium ml-1">Days</span>
        </p>
      </motion.div>
    </motion.div>
  )
}

export default StatsGrid;