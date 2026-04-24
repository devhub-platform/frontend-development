/* eslint-disable no-unused-vars */
import React from "react";
import { ArrowBigUp, MessageSquare, Eye, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function QuestionCard({ question }) {
  const isResolved = question.is_resolved;

  return (
    <Link to={`/questions/${question.id}`} className="block group">
      <article className="bg-white dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-text-dark group-hover:underline transition-colors line-clamp-2">
            {question.title}
          </h3>
          {isResolved && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded text-[10px] font-bold uppercase">
              <CheckCircle2 className="w-3 h-3" /> Resolved
            </span>
          )}
        </div>

        {/* Preview للـ content كـ Markdown، مش نص خام */}
        <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 overflow-hidden">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // علشان الكارد صغير: نخلي الهيدنج باراجراف عادي
              h1: "p",
              h2: "p",
              h3: "p",
              h4: "p",
              h5: "p",
              h6: "p",
              // الكود inline يبقى واضح، البلوك نخليه بسيط جوه الكارد
              code: ({ node, inline, className, children, ...props }) =>
                inline ? (
                  <code
                    className="px-1 rounded bg-gray-100 dark:bg-gray-800 text-[12px]"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <code className="text-[12px]" {...props}>
                    {children}
                  </code>
                ),
              // الكوت كـ باراجراف ببوردر خفيف
              blockquote: ({ node, children, ...props }) => (
                <blockquote
                  className="border-l-2 border-gray-200 dark:border-gray-700 pl-2 italic text-gray-500 dark:text-gray-400"
                  {...props}
                >
                  {children}
                </blockquote>
              ),
            }}
          >
            {question.content || ""}
          </ReactMarkdown>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full 
                bg-gray-50 dark:bg-bg-secondary-dark 
                border border-gray-200 dark:border-gray-600 
                text-xs sm:text-[13px] 
                text-primary dark:text-text-dark
                hover:bg-primary/5 dark:hover:bg-text-dark/10
                transition-colors"
            >
              #{tag.name}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-50 dark:border-gray-800">
          {/* Stats Bar */}
          <div className="flex items-center gap-2">
            {/* Votes Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-[13px] border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
              <ArrowBigUp className="w-4 h-4 text-orange-500" />
              <span className="font-medium">{question.vote_score}</span>
              <span className="hidden sm:inline">votes</span>
            </div>

            {/* Answers Pill */}
            <div
              className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-[13px] border transition-colors
        ${
          question.answers_count > 0
            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
            : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300"
        }
      `}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">{question.answers_count}</span>
              <span className="hidden sm:inline">
                {question.answers_count === 1 ? "answer" : "answers"}
              </span>
            </div>

            {/* Views Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-[13px] border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{question.views}</span>
              <span className="hidden sm:inline">views</span>
            </div>
          </div>

          {/* Author & Time */}
          <div className="flex items-center gap-2">
            <img
              src={
                question.user?.avatar ||
                `https://ui-avatars.com/api/?name=${question.user?.name}&background=random`
              }
              className="w-7 h-7 rounded-full object-cover border border-gray-100 dark:border-gray-700"
              alt="avatar"
            />
            <div className="flex flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                {question.user?.name}
              </span>
              <span className="hidden sm:inline text-gray-400">•</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                asked {question.created_at}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
