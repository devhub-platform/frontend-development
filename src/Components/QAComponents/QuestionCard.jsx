// src/Components/QAComponents/QuestionCard.jsx
import React from "react";
import { ArrowBigUp, MessageSquare, Eye, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export function QuestionCard({ question, dimmed }) {
  const hasAnswers = question.answers > 0;
  const isHot = question.views > 1500 || question.votes > 50; // مثال بسيط
  const isAccepted = question.accepted === true; // لو عندك flag للإجابة المقبولة

  return (
    <Link
      to={`/questions/${question.id}`}
      className={`block group ${
        dimmed ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      <article
        className="
          bg-white dark:bg-bg-primary-dark 
          border border-gray-200 dark:border-gray-700 
          rounded-2xl p-5 sm:p-6 
          shadow-[0_1px_3px_rgba(15,23,42,0.08)] 
          hover:shadow-[0_16px_40px_rgba(15,23,42,0.22)] 
          hover:-translate-y-0.5 
          transition-all duration-200
        "
      >
        {/* أعلى الكارد: عنوان + Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3
            className="
              text-base sm:text-lg font-semibold 
              text-text-light dark:text-text-dark 
              leading-snug 
              group-hover:text-primary dark:group-hover:text-text-dark 
              group-hover:underline underline-offset-2
              line-clamp-2
            "
          >
            {question.title}
          </h3>

          {isHot && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-[11px] font-medium text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-orange-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Hot
            </span>
          )}
        </div>

        {/* وصف مختصر */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {question.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="
                px-3 py-1 rounded-full 
                bg-gray-50 dark:bg-bg-secondary-dark 
                border border-gray-200 dark:border-gray-600 
                text-xs sm:text-[13px] 
                text-primary dark:text-text-dark
                hover:bg-primary/5 dark:hover:bg-text-dark/10
                transition-colors
              "
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats + author row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Stats bar */}
          <div className="flex items-center gap-2 text-xs sm:text-[13px]">
            {/* votes */}
            <StatPill
              icon={<ArrowBigUp className="w-4 h-4" />}
              label="votes"
              value={question.votes}
            />

            {/* answers */}
            <div
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-[13px] border 
                transition-colors
                ${
                  hasAnswers
                    ? isAccepted
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
                    : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-bg-secondary-dark text-gray-700 dark:text-gray-300"
                }
              `}
            >
              {isAccepted && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              )}
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">{question.answers}</span>
              <span className="hidden sm:inline">
                {hasAnswers ? "answers" : "answer"}
              </span>
            </div>

            {/* views */}
            <StatPill
              icon={<Eye className="w-4 h-4" />}
              label="views"
              value={question.views}
            />
          </div>

          {/* Author */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-primary to-text-light flex items-center justify-center text-white text-[11px] font-semibold">
              {question.avatar}
            </div>
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              {question.author}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="truncate">asked {question.timeAgo}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function StatPill({ icon, value, label }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-bg-secondary-dark text-gray-700 dark:text-gray-200">
      {icon}
      <span className="text-sm font-medium">{value}</span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}
