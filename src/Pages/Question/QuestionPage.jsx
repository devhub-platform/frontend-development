/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Bookmark,
  Share2,
  Clock,
  Eye as EyeIcon,
  BarChart2,
  Edit3,
  ArrowBigUp,
  ArrowBigDown,
  User as UserIcon,
  X,
  Copy,
  Check,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react";
import {
  fetchQuestionById,
  voteQuestion,
  fetchQuestionShareData,
} from "../../services/qaApi";
import { QuestionBody } from "../../Components/Question/QuestionBody";
import { AnswerEditor } from "../../Components/Question/AnswerEditor";
import { AnswersList } from "../../Components/Question/AnswersList";
import toast, { Toaster } from "react-hot-toast";

export default function QuestionPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [questionScore, setQuestionScore] = useState(0);
  const [currentUserVote, setCurrentUserVote] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(false);
  const [error, setError] = useState(null);

  const [localAnswers, setLocalAnswers] = useState([]);

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // تحميل السؤال من الـ API
  useEffect(() => {
    let isMounted = true;
    async function loadQuestion() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchQuestionById(id);
        if (!isMounted) return;
        setQuestion(data);
        setQuestionScore(data.vote_score ?? 0);
        setCurrentUserVote(data.current_user_vote);
        setLocalAnswers(data.answers || []);
      } catch (err) {
        if (!isMounted) return;
        setError(
          err.response?.data?.message ||
            "Failed to load question. Please try again.",
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadQuestion();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleNewAnswerAdded = (newAnswerObj) => {
    setLocalAnswers((prev) => [...prev, newAnswerObj]);
    setQuestion((prev) =>
      prev ? { ...prev, answers_count: prev.answers_count + 1 } : null,
    );
  };

  const handleShareClick = async () => {
    setShowShareModal(true);
    if (shareData) return;

    try {
      setShareLoading(true);
      const res = await fetchQuestionShareData(id);
      if (res?.success) {
        setShareData(res.data);
      }
    } catch (err) {
      toast.error("Failed to fetch share link. Please try again.");
      setShowShareModal(false);
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopyLink = async () => {
    const linkToCopy =
      shareData?.url || shareData?.slug_url || window.location.href;
    await navigator.clipboard.writeText(linkToCopy);
    setIsCopied(true);
    toast.success("Link copied to clipboard! 📋");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleVote = async (direction) => {
    if (!question || voteLoading) return;

    const isUp = direction === "up";
    const newType = isUp ? "upvote" : "downvote";
    const prevVote = currentUserVote;
    const prevScore = questionScore;
    let optimisticScore = questionScore;

    if (newType === "upvote") {
      if (prevVote === "upvote") optimisticScore -= 1;
      else if (prevVote === "downvote") optimisticScore += 2;
      else if (prevVote === null) optimisticScore += 1;
    } else if (newType === "downvote") {
      if (prevVote === "downvote") optimisticScore += 1;
      else if (prevVote === "upvote") optimisticScore -= 2;
      else if (prevVote === null) optimisticScore -= 1;
    }

    setQuestionScore(optimisticScore);
    setCurrentUserVote(newType);
    setVoteLoading(true);

    try {
      const data = await voteQuestion(id, newType);
      setQuestionScore(
        typeof data.vote_score === "number" ? data.vote_score : optimisticScore,
      );
      setCurrentUserVote(data.current_user_vote);
    } catch (err) {
      setQuestionScore(prevScore);
      setCurrentUserVote(prevVote);

      if (err.response?.status === 401) {
        toast.error("You must be logged in to vote.");
      } else {
        toast.error(
          err.response?.data?.message || "Failed to record your vote.",
        );
      }
    } finally {
      setVoteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-secondary-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Loading question...
          </p>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-secondary-dark">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
            {error || "Question not found"}
          </p>
          <Link
            to="/qa"
            className="text-sm text-primary dark:text-text-dark hover:underline"
          >
            Back to Questions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-secondary-dark transition-colors">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-text)",
            border: "1px solid var(--toast-border)",
            borderRadius: "12px",
            padding: "12px 14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            maxWidth: "420px",
            width: "100%",
          },
          success: {
            iconTheme: { primary: "var(--color-primary)", secondary: "white" },
            style: { border: "1px solid rgba(0,56,144,0.25)" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "white" },
          },
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] dark:text-white leading-tight mb-6 tracking-tight ">
              {question.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-[12px] font-bold uppercase tracking-widest text-gray-400">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-bg-primary-dark rounded-full border border-gray-100 dark:border-gray-700 shadow-sm">
                <Clock className="w-4 h-4 text-primary" /> {question.created_at}
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-bg-primary-dark rounded-full border border-gray-100 dark:border-gray-700 shadow-sm">
                <EyeIcon className="w-4 h-4 text-amber-500" /> {question.views}{" "}
                Views
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-bg-primary-dark rounded-full border border-gray-100 dark:border-gray-700 shadow-sm">
                <BarChart2 className="w-4 h-4 text-emerald-500" />{" "}
                {questionScore} Votes
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-bg-primary-dark rounded-full border border-gray-100 dark:border-gray-700 shadow-sm">
                <UserIcon className="w-4 h-4 text-sky-500" />{" "}
                {question.answers_count} Answers
              </span>
            </div>
          </div>
          <button
            onClick={() => setBookmarked((b) => !b)}
            className={`shrink-0 flex items-center justify-center w-14 h-14 rounded-3xl border transition-all cursor-pointer ${
              bookmarked
                ? "bg-amber-400 border-amber-400 text-white shadow-xl"
                : "bg-white dark:bg-bg-primary-dark border-gray-200 dark:border-gray-700 text-gray-300 hover:text-amber-500 shadow-sm"
            }`}
          >
            <Bookmark
              className={`w-7 h-7 ${bookmarked ? "fill-current" : ""}`}
            />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          <section className="min-w-0">
            {/* Question card */}
            <article className="bg-white dark:bg-bg-primary-dark rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-12">
              <div className="p-8 sm:p-10">
                <QuestionBody question={question} />

                {/* Footer bar */}
                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center bg-gray-50 dark:bg-bg-secondary-dark p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <button
                      onClick={() => handleVote("up")}
                      disabled={voteLoading}
                      className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                        currentUserVote === "upvote"
                          ? "bg-primary text-white shadow-md"
                          : "hover:bg-primary hover:text-white text-gray-400"
                      }`}
                    >
                      <ArrowBigUp className="w-7 h-7" />
                    </button>
                    <span className="px-4 text-lg font-black text-[#0F172A] dark:text-white">
                      {questionScore}
                    </span>
                    <button
                      onClick={() => handleVote("down")}
                      disabled={voteLoading}
                      className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                        currentUserVote === "downvote"
                          ? "bg-red-500 text-white shadow-md"
                          : "hover:bg-red-500 hover:text-white text-gray-400"
                      }`}
                    >
                      <ArrowBigDown className="w-7 h-7" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShareClick}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 dark:hover:bg-bg-secondary-dark transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Answers section */}
            <div className="mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <h2 className="text-2xl font-black text-[#0F172A] dark:text-white uppercase tracking-tighter">
                  Discussion ({localAnswers.length})
                </h2>
              </div>
              <AnswersList answers={localAnswers} />
            </div>

            {/* Contribute Solution Area */}
            <div className="mt-20">
              <h2 className="text-2xl font-black text-[#0F172A] dark:text-white mb-6">
                Contribute Your Solution
              </h2>
              <AnswerEditor
                questionId={id}
                onAnswerSuccess={handleNewAnswerAdded}
              />
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-white dark:bg-bg-primary-dark rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-primary mb-6">
                Question Owner
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-bg-secondary-dark flex items-center justify-center overflow-hidden">
                  {question.user?.avatar ? (
                    <img
                      src={question.user.avatar}
                      alt={question.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                      {question.user?.name?.[0] || "U"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {question.user?.name || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Asked {question.created_at}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Views: {question.views} · Votes: {question.vote_score}
              </p>
            </div>

            <div className="bg-linear-to-br from-primary to-text-light rounded-3xl p-8 text-white shadow-2xl shadow-primary/20">
              <BarChart2 className="w-8 h-8 mb-4 opacity-40" />
              <h4 className="font-black text-lg mb-2">Grow Together</h4>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                Sharing your solutions helps developers worldwide and builds
                your reputation in the DevHub community.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          />
          <div className="relative z-50 max-w-md w-full bg-white dark:bg-bg-secondary-dark rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-2xl text-gray-900 dark:text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black uppercase tracking-tight">
                Share Question
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-bg-primary-dark text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {shareLoading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-xs text-gray-400">
                  Generating short link...
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Share this discussion with your network to get solutions
                  faster:
                </p>

                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-bg-primary-dark rounded-xl border border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    readOnly
                    value={
                      shareData?.url ||
                      shareData?.slug_url ||
                      window.location.href
                    }
                    className="flex-1 bg-transparent text-xs text-gray-600 dark:text-gray-300 outline-none overflow-x-auto whitespace-nowrap pl-1"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {isCopied ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 block mb-2">
                    Or share via social networks
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this question on DevHub: "${shareData?.title || ""}"`)}&url=${encodeURIComponent(shareData?.url || window.location.href)}&hashtags=${shareData?.tags?.join(",") || "devhub"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-bg-primary-dark rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/40 transition-colors gap-1.5"
                    >
                      <Twitter className="w-5 h-5 text-sky-500 fill-current" />
                      <span className="text-[11px] font-bold">Twitter</span>
                    </a>

                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData?.url || window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-bg-primary-dark rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/40 transition-colors gap-1.5"
                    >
                      <Linkedin className="w-5 h-5 text-blue-600 fill-current" />
                      <span className="text-[11px] font-bold">LinkedIn</span>
                    </a>

                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData?.url || window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-bg-primary-dark rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/40 transition-colors gap-1.5"
                    >
                      <Facebook className="w-5 h-5 text-blue-800 fill-current" />
                      <span className="text-[11px] font-bold">Facebook</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
