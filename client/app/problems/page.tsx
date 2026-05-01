"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "@/AuthContext";
import { useRouter } from "next/navigation";

type Difficulty = "Easy" | "Medium" | "Hard";

interface GeneratedProblem {
  title: string;
  topic: string;
  difficulty: Difficulty;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
}

const Problems: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [isGenerating, setIsGenerating] = useState(false);

  // ✅ NEW STATE
  const [problems, setProblems] = useState<GeneratedProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { user } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleGenerate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/problems`,
        { topic, difficulty },
        { withCredentials: true }
      );

      // ✅ Map backend response → UI format
      const mapped = res.data.data.map((q: any) => ({
        title: q.question,
        topic,
        difficulty,
        description: q.explanation,
        examples: [
          {
            input: "-",
            output: q.sample_answer,
          },
        ],
      }));

      setProblems(mapped);
      setCurrentIndex(0);

    } catch (error) {
      console.log(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case "Easy": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "Hard": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  // Auto scroll on next question
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const problem = problems[currentIndex];

  return (
    <div className="min-h-screen bg-black pt-16 pb-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            Generate Practice Problems
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleGenerate}
          className="bg-gray-900 p-6 rounded-xl flex gap-4"
        >
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic..."
            className="flex-1 p-3 bg-black border border-gray-700 text-white rounded"
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="p-3 bg-black border border-gray-700 text-white rounded"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <button
            disabled={isGenerating}
            className="px-6 bg-blue-600 text-white rounded"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </form>

        {/* Loading */}
        {isGenerating && (
          <div className="text-white text-center">Loading...</div>
        )}

        {/* Question Card */}
        <AnimatePresence mode="wait">
          {problem && !isGenerating && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-gray-900 p-6 rounded-xl"
            >
              <h2 className="text-xl text-white font-bold mb-2">
                {problem.title}
              </h2>

              <span className={`px-2 py-1 text-xs border rounded ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>

              <p className="text-gray-300 mt-4">
                {problem.description}
              </p>

              <div className="mt-4">
                <p className="text-green-400">
                  Answer: {problem.examples[0].output}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(prev => prev - 1)}
                  className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-gray-400">
                  {currentIndex + 1} / {problems.length}
                </span>

                <button
                  disabled={currentIndex === problems.length - 1}
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Problems;