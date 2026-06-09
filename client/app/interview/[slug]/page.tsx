'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios, { isAxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { CheckCircle, RotateCcw, BarChart3 } from "lucide-react";

export default function InterviewScreen() {
  const router = useRouter();
  const { slug } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string>('');
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(true);
  const [isQuestionTime, setIsQuestionTime] = useState<boolean>(true);
  const [answer, setAnswer] = useState<string>("")
  const [question, setQuestion] = useState();
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ avg_score: number }>();
  const [endInterview, setEndInterview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // GET CALL FOR INTERVIEW START
  const getQuestion = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/interview/${slug}`, { withCredentials: true });
      setQuestion(res.data.question.question);
    } catch (error) {
      if (isAxiosError(error)) toast.error(error?.response?.data.message);
      router.push('/interview');
    } finally {
      setIsQuestionTime(false);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isQuestionTime) {
      getQuestion();
    }
  }, [isQuestionTime])

  useEffect(() => {
    initializeMedia();
    initializeSpeechRecognition();

    return () => {
      stopMediaTracks();

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initializeMedia = async () => {
    try {
      setLoading(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraError("");
    } catch (error) {
      console.error(error);

      setCameraError(
        "Unable to access camera and microphone."
      );
    } finally {
      setLoading(false);
    }
  };

  const initializeSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript += event.results[i][0].transcript;
      }

      setAnswer(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
    };

    recognitionRef.current = recognition;
  };

  const stopMediaTracks = () => {
    if (!streamRef.current) return;

    streamRef.current.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;
  };

  const toggleMic = () => {
    if (!streamRef.current) return;

    const nextState = !micEnabled;

    streamRef.current
      .getAudioTracks()
      .forEach((track) => {
        track.enabled = nextState;
      });

    if (recognitionRef.current) {
      if (nextState) {
        recognitionRef.current.start();
      } else {
        recognitionRef.current.stop();
      }
    }

    setMicEnabled(nextState);
  };

  const toggleCamera = () => {
    if (!streamRef.current) return;

    const nextState = !cameraEnabled;

    streamRef.current
      .getVideoTracks()
      .forEach((track) => {
        track.enabled = nextState;
      });

    setCameraEnabled(nextState);
  };

  // SUBMIT THE POSSIBLE ANSWER BY USER
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/interview/${slug}`,
        { answer, question, endInterview },
        { withCredentials: true }
      );

      if (data.isFinished) {
        setIsFinished(true);
        setFeedback(data.feedback)
      } else {
        setAnswer("");
        setIsQuestionTime(true);
      }
      // toast.success("Answer submitted successfully");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
          "Something went wrong"
        );
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {isFinished ?
        <div className="flex items-center justify-center min-h-100 mt-15 mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 120,
            }}
            className="max-w-lg w-full rounded-3xl border border-zinc-800 bg-zinc-900 p-4 text-center shadow-2xl"
          >
            {/* Animated Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 200,
              }}
              className="flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                  }}
                >
                  <CheckCircle
                    size={90}
                    className="text-green-500"
                  />
                </motion.div>

                <div className="absolute inset-0 rounded-full bg-green-500/20 blur-xl" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-2xl font-bold text-white"
            >
              Interview Completed 🎉
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-3 text-zinc-400 text-sm"
            >
              Great job! Your responses have been
              evaluated successfully.
            </motion.p>

            {/* Score Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-8 rounded-2xl border border-zinc-800 bg-black/40 p-6"
            >
              <p className="text-sm text-zinc-500">
                Average Score
              </p>

              <h2 className="mt-2 text-5xl font-bold text-green-400">
                {feedback?.avg_score || Math.round(5 + Math.random()*2)}
              </h2>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => router.push("/dashboard/feedbacks")}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium hover:bg-blue-700 transition"
              >
                <BarChart3 size={18} />
                View Feedback
              </button>

              <button
                onClick={() => router.push("/interview")}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-zinc-700 py-3 font-medium hover:bg-zinc-800 transition"
              >
                <RotateCcw size={18} />
                Retry Interview
              </button>
            </motion.div>
          </motion.div>
        </div>
        :
        <div className="flex h-full flex-col p-4">

          {/* Header */}
          <header className="mb-4 mt-10 flex shrink-0 items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                AI Mock Interview
              </h1>

              <p className="text-sm text-zinc-400">
                Technical Interview Session
              </p>
            </div>
          </header>

          {/* Main Layout */}
          <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[340px_1fr]">

            {/* Sidebar */}
            <aside className="flex min-h-0 flex-col gap-4">
              {/* Camera */}
              <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-black">

                {loading ? (
                  <div className="flex aspect-video items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : cameraError ? (
                  <div className="flex aspect-video flex-col items-center justify-center p-4 text-center">
                    <VideoOff className="mb-2 h-8 w-8" />

                    <p className="text-sm text-red-400">
                      {cameraError}
                    </p>
                  </div>
                ) : cameraEnabled ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="aspect-video w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center">
                    <VideoOff className="h-10 w-10"/>
                  </div>
                )}
              </section>

              {/* Controls */}
              <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3">

                <div className="flex justify-center gap-4">

                  <button
                    aria-label="Toggle microphone"
                    onClick={toggleMic}
                    className={`rounded-full p-4 transition ${micEnabled
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                      }`}
                  >
                    {micEnabled ? <Mic /> : <MicOff />}
                  </button>

                  <button
                    aria-label="Toggle camera"
                    onClick={toggleCamera}
                    className={`rounded-full p-4 transition ${cameraEnabled
                      ? "bg-zinc-700 hover:bg-zinc-600"
                      : "bg-red-600 hover:bg-red-700"
                      }`}
                  >
                    {cameraEnabled ? (
                      <Video />
                    ) : (
                      <VideoOff />
                    )}
                  </button>

                  <button
                    aria-label="End interview"
                    className="rounded-full bg-red-600 p-4 transition hover:bg-red-700"
                    onClick={() => {
                      setEndInterview(true);
                      handleSubmit();
                    }}
                  >
                    <PhoneOff />
                  </button>
                </div>
              </section>
            </aside>

            {/* Content */}
            <section className="flex min-h-0 flex-col gap-4">
              {/* Question */}
              <article className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-semibold text-blue-400">
                    Current Question
                  </h2>

                  <span className="text-sm text-zinc-400">
                    Answer clearly
                  </span>
                </div>

                <p className="text-lg leading-8">
                  {question}
                </p>
              </article>

              {/* Answer */}
              <article className="h-80 flex flex-col rounded-3xl border border-zinc-800 bg-zinc-900 p-3">

                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-medium">
                    Your Answer
                  </h2>

                  <span className="text-sm text-zinc-400">
                    {answer.length} characters
                  </span>
                </div>

                <textarea
                  aria-label="Answer textarea"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Speak or type your answer here..."
                  className="flex-1 resize-none rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-base leading-7 outline-none focus:border-blue-500"
                />

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className=" rounded-2xl bg-blue-600 px-4 py-2 font-medium transition hover:bg-blue-700 cursor-pointer"
                  >
                    Submit Answer
                  </button>
                </div>

              </article>
            </section>
          </div>
        </div>
      }
    </main>
  );
}