import React from "react";
import { motion } from "framer-motion";

// 1. Types & Mock Data
type InterviewFormType = {
  domain?: string;
  interview_level?: string;
  answer?: string,
  sessionId?: string,
};

type SelectorType = {
  interviewForm: InterviewFormType
  setIsInterviewStart: React.Dispatch<React.SetStateAction<boolean>>,
  setInterviewForm?: React.Dispatch<React.SetStateAction<InterviewFormType>>
}

const PRESET_DOMAINS = [
  { id: "web", name: "Web Development", icon: "🌐" },
  { id: "backend", name: "Backend & APIs", icon: "⚙️" },
  { id: "system_design", name: "System Design", icon: "🏗️" },
  { id: "data_science", name: "Data Science", icon: "📊" },
];

const LEVELS = [
  { id: "easy", name: "Easy", color: "text-green-400", bgHover: "hover:border-green-500/50 hover:bg-green-500/10", activeBorder: "border-green-500", activeBg: "bg-green-500/20" },
  { id: "medium", name: "Medium", color: "text-yellow-400", bgHover: "hover:border-yellow-500/50 hover:bg-yellow-500/10", activeBorder: "border-yellow-500", activeBg: "bg-yellow-500/20" },
  { id: "hard", name: "Hard", color: "text-red-400", bgHover: "hover:border-red-500/50 hover:bg-red-500/10", activeBorder: "border-red-500", activeBg: "bg-red-500/20" },
];

// 2. Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function InterviewSelector({ interviewForm, setInterviewForm, setIsInterviewStart }: SelectorType) {
  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 flex items-center justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl space-y-10"
      >

        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Configure Your Mock Interview
          </h1>
          <p className="text-gray-400 text-lg">
            Select your target domain and difficulty level to generate a tailored AI session.
          </p>
        </motion.div>

        {/* Domain Selection */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h2 className="text-lg font-semibold text-white tracking-wide uppercase">1. Select or Type Domain</h2>

          {/* Quick Preset Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRESET_DOMAINS.map((domain) => {
              const isActive = interviewForm.domain === domain.name;
              return (
                <motion.button
                  key={domain.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInterviewForm && setInterviewForm({ ...interviewForm, domain: domain.name })}
                  className={`relative p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col items-center justify-center gap-3 ${isActive
                      ? "border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                      : "border-gray-800 bg-gray-900/40 hover:border-blue-500/50 hover:bg-gray-800"
                    }`}
                >
                  <span className="text-3xl">{domain.icon}</span>
                  <span className={`text-sm font-medium text-center ${isActive ? "text-blue-400" : "text-gray-300"}`}>
                    {domain.name}
                  </span>

                  {/* Active Indicator Dot */}
                  {isActive && (
                    <motion.div
                      layoutId="activeDomain"
                      className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-gray-800 flex-1" />
            <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">OR</span>
            <div className="h-px bg-gray-800 flex-1" />
          </div>

          {/* Custom Input Field */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className={`w-5 h-5 transition-colors ${interviewForm.domain ? "text-blue-400" : "text-gray-500 group-focus-within:text-blue-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={interviewForm.domain}
              onChange={(e) => setInterviewForm && setInterviewForm({ ...interviewForm, domain: e.target.value })}
              placeholder="Type any specific topic (e.g., React.js, Docker, Java...)"
              className={`w-full bg-gray-900/40 border rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${interviewForm.domain
                  ? "border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                  : "border-gray-800 focus:border-blue-500/50 focus:bg-gray-800"
                }`}
            />
          </div>
        </motion.div>

        {/* Level Selection */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-lg font-semibold text-white tracking-wide uppercase">2. Select Difficulty</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LEVELS.map((level) => {
              const isActive = interviewForm.interview_level === level.id;
              return (
                <motion.button
                  key={level.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInterviewForm && setInterviewForm({ ...interviewForm, interview_level: level.id })}
                  className={`p-5 rounded-2xl border transition-all duration-300 flex items-center justify-center ${isActive
                      ? `${level.activeBorder} ${level.activeBg}`
                      : `border-gray-800 bg-gray-900/40 ${level.bgHover}`
                    }`}
                >
                  <span className={`text-lg font-bold ${isActive ? level.color : "text-gray-400"}`}>
                    {level.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Action Bar */}
        <motion.div variants={itemVariants} className="pt-8 border-t border-gray-800 flex justify-end">
          <motion.button
            whileHover={interviewForm.domain?.trim() && interviewForm.interview_level?.trim() ? { scale: 1.05 } : {}}
            whileTap={interviewForm.domain?.trim() && interviewForm.interview_level?.trim() ? { scale: 0.95 } : {}}
            onClick={() => setIsInterviewStart(true)}
            disabled={!interviewForm.domain || !interviewForm.interview_level}
            className={`px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-3 transition-all ${interviewForm.domain?.trim() && interviewForm.interview_level
                ? "bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
          >
            Start Interview
          </motion.button>
        </motion.div>

      </motion.div>
    </div>
  );
}