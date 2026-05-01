"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import InterviewSelector from '@/components/UI/InterviewSelector';
import { useAuth } from "@/AuthContext";
import { useRouter } from "next/navigation";

type QAResponse = {
  question?: string;
  feedback?: string;
  score?: number;
  suggestion?: string;
};

type InterviewType = {
  domain?: string,
  interview_level?: string,
  answer?: string,
  sessionId?: string
}

const Interview: React.FC = () => {
  const [sessionId] = useState(() => crypto.randomUUID());

  const [interviewForm, setInterviewForm] = useState<InterviewType>({
    domain: "",
    interview_level: "",
    answer: "",
    sessionId: sessionId
  });
  const [isInterviewStart, setIsInterviewStart] = useState<boolean>(false);
  const [question, setQuestion] = useState("");
  const [listening, setListening] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const isManualStopRef = useRef(false);

  // NEW: This ref acts as a permanent memory bank for the text to survive mic restarts
  const fullTranscriptRef = useRef("");

  useEffect(() => {
    if (cameraOn && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [cameraOn, stream]);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [stream]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported. Please use desktop Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    // UPDATED: Completely rebuilt text processor
    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i].transcript;
        } else {
          interimTranscript += event.results[i].transcript;
        }
      }

      // If a sentence is finished, save it to our permanent memory bank
      if (finalTranscript) {
        fullTranscriptRef.current += finalTranscript + " ";
      }

      // Display the permanent memory + whatever is currently being spoken
      setInterviewForm({ ...interviewForm, answer: fullTranscriptRef.current + interimTranscript });
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        return;
      }
      console.error("Mic error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      if (!isManualStopRef.current) {
        try {
          recognition.start();
        } catch (e) {
          setListening(false);
        }
      } else {
        setListening(false);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const speak = (text: string) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const toggleCamera = async () => {
    try {
      if (cameraOn) {
        stream?.getTracks().forEach((t) => t.stop());
        setStream(null);
        setCameraOn(false);
        return;
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(mediaStream);
      setCameraOn(true);
    } catch (err) {
      console.log("Camera error:", err);
      alert("Camera permission denied or not available.");
    }
  };

  const toggleMic = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      isManualStopRef.current = true;
      recognitionRef.current.stop();
    } else {
      isManualStopRef.current = false;
      // Reset memory banks when manually starting a new answer
      fullTranscriptRef.current = "";
      setInterviewForm({ ...interviewForm, answer: "" });
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const sendAnswer = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/interview`,
        interviewForm,
        { withCredentials: true }
      );

      const data: QAResponse = res.data.data.response;
      setQuestion(data.question || "");
      setQuestionCount(res.data.data.questionCount);
      setIsFinished(res.data.data.isFinished);

      // Clear answer text and memory
      fullTranscriptRef.current = "";
      setInterviewForm({ ...interviewForm, answer: "" });

      if (listening && recognitionRef.current) {
        isManualStopRef.current = true;
        recognitionRef.current.stop();
        setListening(false);
      }

      speak(data.question || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInterviewStart) {
      sendAnswer();
    }
  }, [isInterviewStart]);

  return (
    <div className="min-h-screen bg-black pt-28 pb-12 px-4 sm:px-6">
      {/* Interview Selector */}
      {
        !isInterviewStart ?
          <InterviewSelector
            interviewForm={interviewForm}
            setInterviewForm={setInterviewForm}
            setIsInterviewStart={setIsInterviewStart}
          />
          :
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header & Progress */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-900/50 backdrop-blur-md border border-gray-800 p-6 rounded-2xl">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Mock Interview</h1>
                <p className="text-sm text-gray-400 mt-1">Domain: Web Development • Level: Easy</p>
              </div>
              <div className="w-full sm:w-1/3 space-y-2">
                <div className="flex justify-between text-sm font-medium text-gray-400">
                  <span>Progress</span>
                  <span>{questionCount} / 3</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(questionCount / 3) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Video Feeds Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* AI Interviewer Pane */}
              <div className="relative bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl aspect-video md:aspect-4/3 flex flex-col items-center justify-center overflow-hidden shadow-lg">
                <motion.div
                  animate={{
                    boxShadow: loading ? ["0px 0px 0px 0px rgba(59,130,246,0)", "0px 0px 40px 10px rgba(59,130,246,0.5)", "0px 0px 0px 0px rgba(59,130,246,0)"] : "none",
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-4xl shadow-xl z-10"
                >
                  🤖
                </motion.div>
                <p className="mt-4 text-gray-300 font-medium z-10">{loading ? "AI is thinking..." : "AI Interviewer"}</p>
                <div className="absolute inset-0 bg-linear-to-b from-blue-900/10 to-transparent pointer-events-none" />
              </div>

              {/* User Video Pane */}
              <div className="relative bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl aspect-video md:aspect-4/3 flex flex-col items-center justify-center overflow-hidden shadow-lg">
                {cameraOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="flex flex-col items-center z-10">
                    <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-4xl shadow-xl mb-4">
                      👤
                    </div>
                    <p className="text-gray-400 font-medium">Camera Disabled</p>
                  </div>
                )}

                <AnimatePresence>
                  {listening && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-500/30 z-20"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-medium text-red-400">Recording</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Question & Answer Section */}
            {isFinished ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center"
              >
                <h2 className="text-3xl font-bold text-green-400 mb-2">Interview Completed 🎉</h2>
                <p className="text-green-300/80">Great job! Your answers have been recorded. Check your dashboard for feedback.</p>
              </motion.div>
            ) : (
              <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden shadow-xl">

                <div className="p-6 border-b border-gray-800 bg-gray-800/20">
                  <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Current Question</h3>
                  <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
                    {question || (
                      <span className="flex items-center gap-2 text-gray-500">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        Generating question...
                      </span>
                    )}
                  </p>
                </div>

                <div className="p-6">
                  <textarea
                    value={interviewForm.answer}
                    onChange={(e) => {
                      setInterviewForm({ ...interviewForm, answer: e.target.value });
                      fullTranscriptRef.current = e.target.value;
                    }}
                    placeholder={listening ? "Listening to your answer..." : "Speak or type your answer here..."}
                    disabled={loading}
                    className="w-full h-32 p-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none disabled:opacity-50"
                  />

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button
                        onClick={toggleMic}
                        className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${listening
                          ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
                          : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white"
                          }`}
                      >
                        {listening ? "Stop Mic" : "Start Mic"}
                      </button>
                      <button
                        onClick={toggleCamera}
                        className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${cameraOn
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30"
                          : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white"
                          }`}
                      >
                        {cameraOn ? "Stop Cam" : "Start Cam"}
                      </button>
                    </div>

                    <button
                      onClick={sendAnswer}
                      disabled={loading || isFinished || !interviewForm.answer?.trim()}
                      className="w-full sm:w-auto px-8 py-2.5 bg-white text-black hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                      {loading ? "Submitting..." : "Submit Answer"}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>}
    </div>
  );
};

export default Interview;