import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";


type User = {
  id: string;
  name: string;
  email: string;
  streak?: string;
  mock_interviews?: string,
  problems_solved?: string
};


const StatsGrid = (user: User) => {

  const router = useRouter();

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <motion.div
      variants={itemVariants}
      className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 mt-4"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Recent Performance
          </h2>
          <p className="text-sm text-zinc-400">
            Quick overview of your interview progress
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/feedbacks")}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 transition"
        >
          View All Feedbacks
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="rounded-xl border border-zinc-800 bg-black p-4">
          <p className="text-xs text-zinc-500">
            Total Interviews
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {user.mock_interviews || 0}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black p-4">
          <p className="text-xs text-zinc-500">
            Current Streak
          </p>

          <p className="mt-2 text-2xl font-bold text-orange-500">
            {user.streak || 0}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black p-4">
          <p className="text-xs text-zinc-500">
            Questions Solved
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-500">
            {user.problems_solved || 0}
          </p>
        </div>

      </div>

      <div className="mt-5 rounded-xl border border-zinc-800 bg-black p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">
              Latest Interview
            </h3>

            <p className="text-sm text-zinc-400">
              Keep practicing consistently to improve your score.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard/feedbacks")}
            className="text-blue-500 hover:text-blue-400 text-sm"
          >
            Details →
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default StatsGrid;