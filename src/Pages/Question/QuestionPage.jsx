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
} from "lucide-react";
import { fetchQuestionById, voteQuestion } from "../../services/qaApi";
import { QuestionBody } from "../../Components/Question/QuestionBody";
import { AnswerEditor } from "../../Components/Question/AnswerEditor";
import { AnswersList } from "../../Components/Question/AnswersList";
import toast from "react-hot-toast";

export default function QuestionPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [questionScore, setQuestionScore] = useState(0);
  const [currentUserVote, setCurrentUserVote] = useState(null); // "upvote" | "downvote" | null
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(false);
  const [error, setError] = useState(null);

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
        setCurrentUserVote(data.current_user_vote); // راجعالك من الباك
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

  const answers = useMemo(() => {
    if (!question || !question.answers) return [];
    return [...question.answers];
  }, [question]);

  // هندلة التصويت على السؤال 
  const handleVote = async (direction) => {
    if (!question || voteLoading) return;

    const isUp = direction === "up";

    // نوع الفوت الجديد اللي هنرسله
    const newType = isUp ? "upvote" : "downvote";

    // optimistic UI: نحسب السكور المتوقع حسب الحالة القديمة
    const prevVote = currentUserVote; // "upvote" | "downvote" | null
    const prevScore = questionScore;

    let optimisticScore = questionScore;

    if (newType === "upvote") {
      if (prevVote === "upvote") {
        // احتمال إن الباك يستخدم نفس النوع كتوجّل (يلغي الفوت)
        // مبدئياً ننقص 1 كتوقّع
        optimisticScore -= 1;
      } else if (prevVote === "downvote") {
        optimisticScore += 2; // -1 → +1
      } else if (prevVote === null) {
        optimisticScore += 1;
      }
    } else if (newType === "downvote") {
      if (prevVote === "downvote") {
        // نفس الفكرة - ممكن يكون توجل لإلغاء الفوت
        optimisticScore += 1;
      } else if (prevVote === "upvote") {
        optimisticScore -= 2; // +1 → -1
      } else if (prevVote === null) {
        optimisticScore -= 1;
      }
    }

    // نحدّث الواجهة بشكل متوقَّع
    setQuestionScore(optimisticScore);
    setCurrentUserVote(newType);
    setVoteLoading(true);

    try {
      const data = await voteQuestion(id, newType);

      // sync مع القيم اللي رجعت من الباك
      // لو الباك عمل toggle وألغى الفوت، هيبعت current_user_vote = null
      setQuestionScore(
        typeof data.vote_score === "number" ? data.vote_score : optimisticScore,
      );
      setCurrentUserVote(data.current_user_vote); // "upvote" | "downvote" | null
    } catch (err) {
      // rollback
      setQuestionScore(prevScore);
      setCurrentUserVote(prevVote);

      if (err.response?.status === 401) {
        toast.error("You must be logged in to vote.");
      } else if (err.response?.data?.errors?.vote_type) {
        toast.error(err.response.data.errors.vote_type[0]);
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] dark:text-white leading-tight mb-6 tracking-tight">
              {question.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-[12px] font-bold uppercase tracking-widest text-gray-400">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-bg-primary-dark rounded-full border border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-[0_0_14px_rgba(15,23,42,0.7)]">
                <Clock className="w-4 h-4 text-primary" /> {question.created_at}
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-bg-primary-dark rounded-full border border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-[0_0_14px_rgba(15,23,42,0.7)]">
                <EyeIcon className="w-4 h-4 text-amber-500" /> {question.views}{" "}
                Views
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-bg-primary-dark rounded-full border border-gray-100 dark:border-gray-700 shadow-sm ">
                <BarChart2 className="w-4 h-4 text-emerald-500" />{" "}
                {questionScore} Votes
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-bg-primary-dark rounded-full border border-gray-100 dark:border-gray-700 shadow-sm ">
                <UserIcon className="w-4 h-4 text-sky-500" />{" "}
                {question.answers_count} Answers
              </span>
            </div>
          </div>
          <button
            onClick={() => setBookmarked((b) => !b)}
            className={`shrink-0 flex items-center justify-center w-14 h-14 rounded-3xl border transition-all ${
              bookmarked
                ? "bg-amber-400 border-amber-400 text-white shadow-xl"
                : "bg-white dark:bg-bg-primary-dark border-gray-200 dark:border-gray-700 text-gray-300 hover:text-amber-500 shadow-sm dark:shadow-[0_0_16px_rgba(15,23,42,0.8)]"
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
            <article className="bg-white dark:bg-bg-primary-dark rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-[0_0_30px_rgba(15,23,42,0.95)] overflow-hidden mb-12">
              <div className="p-8 sm:p-10">
                <QuestionBody question={question} />

                {/* Footer bar (Voting + Actions) */}
                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center bg-gray-50 dark:bg-bg-secondary-dark p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-[0_0_15px_rgba(15,23,42,0.85)]">
                    <button
                      onClick={() => handleVote("up")}
                      disabled={voteLoading}
                      className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${
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
                      className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${
                        currentUserVote === "downvote"
                          ? "bg-red-500 text-white shadow-md"
                          : "hover:bg-red-500 hover:text-white text-gray-400"
                      }`}
                    >
                      <ArrowBigDown className="w-7 h-7" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 dark:hover:bg-bg-secondary-dark transition-all">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 dark:hover:bg-bg-secondary-dark transition-all">
                      <Edit3 className="w-4 h-4" /> Edit
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Answers section */}
            <div className="mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <h2 className="text-2xl font-black text-[#0F172A] dark:text-white uppercase tracking-tighter">
                  Discussion ({answers.length})
                </h2>
              </div>
              <AnswersList answers={answers} />
            </div>

            <div className="mt-20">
              <h2 className="text-2xl font-black text-[#0F172A] dark:text-white mb-6">
                Contribute Your Solution
              </h2>
              <AnswerEditor />
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-white dark:bg-bg-primary-dark rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm dark:shadow-[0_0_24px_rgba(15,23,42,0.9)]">
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
    </div>
  );
}
