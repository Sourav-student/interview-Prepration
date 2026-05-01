"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  // const date = Date.now();
  // console.log(new Date(date).toString().split(" ")[2]);
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-gray-800 text-white overflow-hidden">

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 relative">

        {/* Floating Avatars */}
        <motion.div
          className="absolute top-10 left-10 w-16 h-16 rounded-full overflow-hidden"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Image
            src="/robot.png"
            alt="avatar"
            width={80}
            height={80}
          />
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-10 w-20 h-20 rounded-full overflow-hidden max-sm:hidden"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Image
            src="/robot2.png"
            alt="avatar"
            width={80}
            height={80}
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          PrepTrack
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-sm sm:text-lg md:text-xl text-gray-300 max-w-2xl mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          AI-powered platform to track, analyze, and improve your interview preparation with real-time feedback.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/practice" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-center rounded-xl font-semibold transition">
            Get Started
          </Link>

          <Link href="/aboutus" className="px-6 py-3 border border-gray-500 hover:border-white rounded-xl transition">
            Learn More
          </Link>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="grid md:grid-cols-3 gap-6 px-10 pb-20">

        {[
          {
            title: "AI Feedback",
            desc: "Get detailed feedback after every submission",
          },
          {
            title: "Progress Tracking",
            desc: "Visualize your growth with analytics",
          },
          {
            title: "Smart Practice",
            desc: "AI-generated questions based on your level",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-blue-500/20"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* CTA SECTION */}
      <section className="text-center pb-20">
        <motion.h2
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Start Your Interview Journey 🚀
        </motion.h2>

        <Link
          href="/interview"
          className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-lg font-semibold"
        >
          Join Now
        </Link>
      </section>
    </div>
  );
}