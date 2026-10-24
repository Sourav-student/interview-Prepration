"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios, { isAxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle, AudioLines, BarChart3, CheckCircle, Loader2, Mic, MicOff,
  PhoneOff, Play, RotateCcw, Volume2, VolumeX, Video, VideoOff,
} from "lucide-react";
import toast from "react-hot-toast";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string; isFinal?: boolean }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

const buttonBase = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export default function InterviewScreen() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const answerRef = useRef("");
  const speakingRef = useRef(false);

  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [answer, setAnswer] = useState("");
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ avg_score?: number }>();

  const loadQuestion = useCallback(async () => {
    if (!slug) {
      setQuestionError("This interview link is missing its session ID.");
      setLoadingQuestion(false);
      return;
    }
    setLoadingQuestion(true);
    setQuestionError("");
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/interview/${encodeURIComponent(slug)}`, { withCredentials: true });
      const nextQuestion = res.data?.question?.question;
      if (typeof nextQuestion !== "string" || !nextQuestion.trim()) throw new Error("The interview service did not return a question. Please try again.");
      setQuestion(nextQuestion.trim());
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.message || "Could not load your question. Please try again." : error instanceof Error ? error.message : "Could not load your question. Please try again.";
      setQuestionError(message);
    } finally {
      setLoadingQuestion(false);
    }
  }, [slug]);

  useEffect(() => { void loadQuestion(); }, [loadQuestion]);

  useEffect(() => {
    if (!question || !voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.lang = "en-US";
    utterance.rate = 0.94;
    utterance.onstart = () => { speakingRef.current = true; };
    utterance.onend = () => { speakingRef.current = false; };
    window.speechSynthesis.speak(utterance);
    return () => { window.speechSynthesis.cancel(); speakingRef.current = false; };
  }, [question, voiceEnabled]);

  useEffect(() => () => {
    recognitionRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (!videoRef.current || !streamRef.current) return;
    videoRef.current.srcObject = streamRef.current;
  }, [cameraEnabled, mediaLoading]);

  const requestMedia = async (kind?: "audio" | "video") => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMediaError("Camera and microphone access requires a supported browser and a secure connection (HTTPS).");
      return;
    }
    setMediaLoading(true);
    setMediaError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: kind !== "audio", audio: kind !== "video" });
      const currentStream = streamRef.current;
      if (currentStream) stream.getTracks().forEach((track) => currentStream.addTrack(track));
      else streamRef.current = stream;
      if (stream.getVideoTracks().length) setCameraEnabled(true);
      if (stream.getAudioTracks().length) setMicEnabled(true);
      if (videoRef.current && streamRef.current) videoRef.current.srcObject = streamRef.current;
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      setMediaError(name === "NotAllowedError" || name === "SecurityError"
        ? "Access was blocked. Allow camera and microphone in your browser’s address bar, then try again. You can still continue by typing."
        : name === "NotFoundError"
          ? "No camera or microphone was found. You can continue by typing your answers."
          : "Could not start your camera and microphone. Check that they are connected and not in use by another app.");
    } finally {
      setMediaLoading(false);
    }
  };

  const toggleCamera = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) { void requestMedia("video"); return; }
    track.enabled = !cameraEnabled;
    setCameraEnabled(!cameraEnabled);
  };

  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (!track) { void requestMedia("audio"); return; }
    const enabled = !micEnabled;
    track.enabled = enabled;
    setMicEnabled(enabled);
    if (!enabled) {
      recognitionRef.current?.stop();
      setListening(false);
    }
  };

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    if (!micEnabled) {
      setMediaError("Turn on microphone access before using voice answers.");
      return;
    }
    const speechWindow = window as SpeechWindow;
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice typing is not supported in this browser. You can type your answer instead.");
      return;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let finalText = answerRef.current;
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result[0]?.transcript || "";
        if (result.isFinal) finalText += `${finalText ? " " : ""}${transcript.trim()}`;
        else interimText += transcript;
      }
      const updated = [finalText, interimText.trim()].filter(Boolean).join(" ");
      answerRef.current = finalText;
      setAnswer(updated);
    };
    recognition.onerror = (event) => {
      if (event.error !== "no-speech" && event.error !== "aborted") toast.error("Voice typing stopped. Your answer is still available to edit.");
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch { toast.error("Voice typing could not start. Please try again."); }
  };

  const handleAnswerChange = (value: string) => {
    answerRef.current = value;
    setAnswer(value);
  };

  const handleSubmit = async (finish = false) => {
    if (submitting) return;
    recognitionRef.current?.stop();
    setListening(false);
    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/interview/${encodeURIComponent(slug)}`,
        { answer: answer.trim(), question, endInterview: finish },
        { withCredentials: true },
      );
      if (data.isFinished) {
        setFeedback(data.feedback);
        setIsFinished(true);
      } else {
        handleAnswerChange("");
        setLoadingQuestion(true);
        await loadQuestion();
      }
    } catch (error) {
      toast.error(isAxiosError(error) ? error.response?.data?.message || "Could not submit your answer. Please try again." : "Could not submit your answer. Please try again.");
    } finally { setSubmitting(false); }
  };

  const playQuestion = () => {
    if (!("speechSynthesis" in window)) { toast.error("Spoken questions are not supported in this browser."); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.lang = "en-US";
    utterance.rate = 0.94;
    window.speechSynthesis.speak(utterance);
  };

  if (isFinished) return (
    <main className="page-shell flex min-h-screen items-center justify-center px-5 pb-12 pt-28 text-white">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="surface w-full max-w-lg rounded-[28px] p-7 text-center sm:p-10">
        <CheckCircle className="mx-auto text-[#b7f36b]" size={56} />
        <p className="eyebrow mt-6">Session complete</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Nice work showing up.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Your answers have been reviewed. Take a look at your feedback to see what went well and what to practice next.</p>
        {typeof feedback?.avg_score === "number" && <div className="mt-7 rounded-2xl border border-white/[.07] bg-white/[.025] p-5"><p className="text-xs text-slate-500">AVERAGE SCORE</p><p className="mt-2 text-4xl font-semibold text-[#b7f36b]">{Math.round(feedback.avg_score)}<span className="text-lg text-slate-500"> / 10</span></p></div>}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row"><button onClick={() => router.push("/dashboard/feedbacks")} className={`${buttonBase} flex-1 bg-[#b7f36b] text-[#10150d]`}><BarChart3 size={17} />View feedback</button><button onClick={() => router.push("/interview")} className={`${buttonBase} flex-1 border border-white/10 text-white hover:bg-white/[.05]`}><RotateCcw size={16} />Try another</button></div>
      </motion.section>
    </main>
  );

  return (
    <main className="page-shell min-h-screen px-4 pb-8 pt-24 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="eyebrow">A little practice goes a long way</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Mock interview</h1><p className="mt-1 text-sm text-slate-400">Take your time. Speak or type, and submit when you’re ready.</p></div>
          <div className="flex items-center gap-2 rounded-full border border-white/[.08] bg-white/[.03] px-3 py-2 text-xs text-slate-400"><span className="h-2 w-2 animate-pulse rounded-full bg-[#b7f36b]" />Interview in progress</div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]">
          <section className="flex min-w-0 flex-col gap-5">
            <article className="surface rounded-[26px] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Your interviewer</p><h2 className="mt-2 text-lg font-semibold">Let’s work through this together</h2></div><button onClick={() => setVoiceEnabled((value) => !value)} className="secondary-button" aria-pressed={voiceEnabled} title={voiceEnabled ? "Mute spoken questions" : "Enable spoken questions"}>{voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}{voiceEnabled ? "Voice on" : "Voice off"}</button></div>
              <div className="mt-5 flex min-h-52 flex-col justify-center rounded-2xl border border-white/[.07] bg-[#0b1016]/80 p-5 sm:p-7">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.15em] text-[#b7f36b]"><AudioLines size={15} />Question</div>
                <p aria-live="polite" className="text-lg leading-8 text-slate-100 sm:text-xl">{loadingQuestion ? <span className="inline-flex items-center gap-3 text-slate-400"><Loader2 className="animate-spin" size={18} />Preparing your next question…</span> : questionError ? <span className="text-amber-200">{questionError}</span> : question}</p>
                {questionError && <button onClick={() => void loadQuestion()} className="mt-4 text-sm font-semibold text-[#b7f36b]">Try loading again</button>}
                {!loadingQuestion && !questionError && question && <button onClick={playQuestion} className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"><Play size={14} />Read question aloud</button>}
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-500">Questions are tailored as you go, based on your earlier answers. You can pause, think, and edit your response before submitting.</p>
            </article>

            <article className="surface flex min-h-[340px] flex-col rounded-[26px] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Your response</p><h2 className="mt-1 font-semibold">Talk it through or type</h2></div><span className="text-xs text-slate-500">{answer.trim().length} characters</span></div>
              <textarea value={answer} onChange={(event) => handleAnswerChange(event.target.value)} onFocus={() => { if (speakingRef.current) window.speechSynthesis.cancel(); }} disabled={loadingQuestion || !!questionError || submitting} aria-label="Your interview answer" placeholder="Your answer will appear here when you speak. You can also type or edit it…" className="mt-4 min-h-48 flex-1 resize-y rounded-2xl border border-white/[.08] bg-[#0b1016] p-4 text-sm leading-7 text-white outline-none placeholder:text-slate-600 focus:border-[#b7f36b]/50 disabled:opacity-60" />
              <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"><button onClick={toggleListening} disabled={loadingQuestion || !!questionError || submitting} className={`${buttonBase} ${listening ? "bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/20" : "border border-white/[.09] text-slate-200 hover:bg-white/[.05]"}`}><span className={`h-2 w-2 rounded-full ${listening ? "animate-pulse bg-rose-400" : "bg-slate-500"}`} />{listening ? "Stop voice typing" : "Start voice typing"}</button><button onClick={() => void handleSubmit()} disabled={loadingQuestion || !!questionError || !question || submitting || !answer.trim()} className={`${buttonBase} bg-[#b7f36b] text-[#10150d] hover:bg-[#c9ff82]`}>{submitting ? <Loader2 size={16} className="animate-spin" /> : null}{submitting ? "Working on your next question…" : "Submit answer"}</button></div>
            </article>
          </section>

          <aside className="flex flex-col gap-5">
            <section className="surface overflow-hidden rounded-[26px]">
              <div className="relative aspect-video bg-[#090d12]">
                {cameraEnabled && streamRef.current ? <video ref={videoRef} autoPlay playsInline muted className="h-full w-full scale-x-[-1] object-cover" /> : <div className="flex h-full flex-col items-center justify-center gap-3 text-center"><span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/[.08] bg-white/[.03] text-slate-400"><VideoOff size={23} /></span><div><p className="text-sm font-medium text-slate-300">Camera preview is off</p><p className="mt-1 text-xs text-slate-600">Camera is optional for this practice</p></div></div>}
                {cameraEnabled && <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] text-white">You</span>}
              </div>
              <div className="p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">Session setup</p><p className="mt-1 text-xs text-slate-500">Allow access when your browser asks</p></div><span className="rounded-full border border-white/[.07] px-2.5 py-1 text-[11px] text-slate-500">Optional</span></div>
                <div className="mt-4 grid grid-cols-2 gap-2"><button onClick={toggleMic} className={`${buttonBase} ${micEnabled ? "border border-[#b7f36b]/20 bg-[#b7f36b]/10 text-[#d6ffab]" : "border border-white/[.08] text-slate-300 hover:bg-white/[.04]"}`}><span className={`h-2 w-2 rounded-full ${micEnabled ? "bg-[#b7f36b]" : "bg-slate-600"}`} />{micEnabled ? "Mic on" : "Turn on mic"}</button><button onClick={toggleCamera} className={`${buttonBase} ${cameraEnabled ? "border border-[#b7f36b]/20 bg-[#b7f36b]/10 text-[#d6ffab]" : "border border-white/[.08] text-slate-300 hover:bg-white/[.04]"}`}>{cameraEnabled ? <Video size={15} /> : <VideoOff size={15} />}{cameraEnabled ? "Camera on" : "Turn on camera"}</button></div>
                {mediaError && <p role="status" className="mt-3 flex items-start gap-2 rounded-xl bg-amber-300/[.06] p-3 text-xs leading-5 text-amber-100/80"><AlertCircle size={15} className="mt-0.5 shrink-0" />{mediaError}</p>}
                {mediaLoading && <p className="mt-3 flex items-center gap-2 text-xs text-slate-400"><Loader2 className="animate-spin" size={14} />Waiting for browser permission…</p>}
                {!micEnabled && !cameraEnabled && !mediaLoading && <button onClick={() => void requestMedia()} className={`${buttonBase} mt-3 w-full border border-white/[.08] text-slate-400 hover:bg-white/[.04]`}>Enable camera and mic together</button>}
              </div>
            </section>

            <section className="surface rounded-[26px] p-5"><p className="eyebrow">Your controls</p><div className="mt-4 grid grid-cols-2 gap-2"><button aria-label={micEnabled ? "Turn microphone off" : "Turn microphone on"} onClick={toggleMic} className={`${buttonBase} ${micEnabled ? "bg-white/[.06] text-white hover:bg-white/[.1]" : "bg-rose-500/15 text-rose-200"}`}>{micEnabled ? <Mic size={16} /> : <MicOff size={16} />}{micEnabled ? "Mic on" : "Mic off"}</button><button aria-label={cameraEnabled ? "Turn camera off" : "Turn camera on"} onClick={toggleCamera} className={`${buttonBase} bg-white/[.06] text-white hover:bg-white/[.1]`}>{cameraEnabled ? <Video size={16} /> : <VideoOff size={16} />}{cameraEnabled ? "Camera on" : "Camera off"}</button></div><button onClick={() => void handleSubmit(true)} disabled={submitting} className={`${buttonBase} mt-3 w-full border border-rose-300/15 text-rose-200 hover:bg-rose-400/[.07]`}><PhoneOff size={16} />End interview</button></section>
            <p className="px-2 text-center text-xs leading-5 text-slate-600">Your camera stays on this page. You can turn off either device at any time.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
