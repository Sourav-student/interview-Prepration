"use client"
import axios, { isAxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { motion, Variants } from "framer-motion";

type QA = {
  question: string;
  answer: string;
  improved_answer: string;
  score: number;
};

type Feedback = {
  _id: string;
  feedback: string;
  domain: string;
  level: string;
  avg_score: number;
  user_res_data: QA[];
  createdAt: string;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 14 },
  },
};

const Feedbacks = () => {
  const [allFeedbacks, setAllFeedbacks] = useState<Feedback[]>();
  const [isLoading, setIsLoading] = useState(true);

  const getAllFeedbacks = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/feedbacks/all`, { withCredentials: true });
      // console.log(res.data.feedbacks);
      const data = res.data.feedbacks;
      const filterData = data.filter((item: Feedback) =>
        item.user_res_data && item.user_res_data.length > 0
      );
      // console.log(filterData);
      setAllFeedbacks(filterData);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error?.response?.data?.message)
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllFeedbacks();
  }, []);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-12 w-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!allFeedbacks?.length) {
    return (
      <div className="max-w-7xl mx-auto mt-10 text-center text-gray-400">
        No feedbacks available
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto mt-20 space-y-6 px-1"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {allFeedbacks.map((item) => (
        <motion.div
          key={item._id}
          variants={itemVariants}
          className="bg-linear-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-5 shadow-lg"
        >
          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {item.domain}
              </h2>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                {item.level}
              </p>
            </div>

            <div className="text-sm text-gray-300">
              Avg Score:{" "}
              <span className="text-blue-400 font-semibold">
                {item.avg_score.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Feedback */}
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            {item.feedback}
          </p>

          {/* Q&A Section */}
          <div className="space-y-3">
            {item.user_res_data.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                No responses recorded
              </p>
            ) : (
              item.user_res_data.map((qa: QA, i: number) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-gray-900/60 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition"
                >
                  <p className="text-sm font-medium text-white">
                    Q{i + 1}: {qa.question}
                  </p>

                  <p className="text-sm mt-2 text-gray-300">
                    <span className="font-semibold text-gray-200">
                      Your Answer:
                    </span>{" "}
                    {qa.answer || "Not answered"}
                  </p>

                  {qa.improved_answer && (
                    <p className="text-sm mt-2 text-green-400">
                      <span className="font-semibold text-green-300">
                        Improvement:
                      </span>{" "}
                      {qa.improved_answer}
                    </p>
                  )}

                  <div className="mt-2 text-xs text-gray-500">
                    Score:{" "}
                    <span className="text-blue-400 font-medium">
                      {qa.score}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default Feedbacks;