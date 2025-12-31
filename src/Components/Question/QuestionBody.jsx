import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function QuestionBody({ question }) {
  const bodyText = question.body || question.excerpt;

  return (
    <div className="w-full">
      {/* Markdown Body */}
      <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert text-[#475569] dark:text-gray-300 mb-8 leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{bodyText}</ReactMarkdown>
      </div>

      {/* Tags & Meta Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-50 dark:border-gray-700 pt-6">
        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-600 text-[10px] font-bold uppercase tracking-wider text-primary dark:text-text-dark hover:bg-primary/5 dark:hover:bg-bg-primary-dark transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Compact Owner Info */}
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-bg-primary-dark px-3 py-2 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-[0_0_18px_rgba(15,23,42,0.6)]">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-primary to-text-light flex items-center justify-center text-white text-[10px] font-black shadow-sm">
            {question.avatar}
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-black text-[#0F172A] dark:text-white leading-none">
              {question.author}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-1">
              {question.timeAgo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
