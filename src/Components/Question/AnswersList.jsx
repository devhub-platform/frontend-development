import React from "react";
import {
  ArrowBigUp,
  ArrowBigDown,
  CheckCircle2,
  Share2,
  Edit3,
} from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import remarkGfm from "remark-gfm";

export function AnswersList({ answers }) {
  if (!answers || answers.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 dark:bg-bg-primary-dark rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">
          No answers yet. Share your knowledge!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {answers.map((answer) => (
        <AnswerCard key={answer.id} answer={answer} />
      ))}
    </div>
  );
}

function AnswerCard({ answer }) {
  const [score, setScore] = React.useState(answer.vote_score ?? 0);

  const acceptedClasses = answer.is_accepted
    ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
    : "";

  const user = answer.user || {};

  return (
    <article
      className={`p-6 sm:p-8 rounded-4xl border transition-all 
      border-gray-200 dark:border-gray-700 
      bg-white dark:bg-bg-primary-dark 
      shadow-sm ${acceptedClasses}`}
    >
      {answer.is_accepted && (
        <div className="absolute top-0 right-10 px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-b-2xl flex items-center gap-1.5 shadow-md z-10">
          <CheckCircle2 className="w-3.5 h-3.5" /> Solution Accepted
        </div>
      )}

      <div className="flex flex-col w-full">
        {/* 🔴 تم تفعيل الـ MDEditor.Markdown هنا لعرض الإجابة كاملة مع دعم جميع التنسيقات */}
        <div
          className="prose prose-sm max-w-none dark:prose-invert text-[#475569] dark:text-gray-300 mb-8 leading-relaxed"
          data-color-mode="light"
        >
          <MDEditor.Markdown
            source={answer.content || ""}
            previewOptions={{
              remarkPlugins: [remarkGfm],
            }}
            style={{
              backgroundColor: "transparent",
              color: "inherit",
            }}
          />
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {/* Vote group */}
            <div className="flex items-center bg-gray-50 dark:bg-bg-secondary-dark p-1 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <button
                onClick={() => setScore((s) => s + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-primary hover:text-white transition-all text-gray-400 cursor-pointer"
              >
                <ArrowBigUp className="w-6 h-6" />
              </button>
              <span className="px-3 text-sm font-black text-[#0F172A] dark:text-white">
                {score}
              </span>
              <button
                onClick={() => setScore((s) => s - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500 hover:text-white transition-all text-gray-400 cursor-pointer"
              >
                <ArrowBigDown className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="p-2.5 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                className="p-2.5 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                title="Edit"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center gap-3 pr-2">
            <div className="text-right">
              <p className="text-[13px] font-black text-[#0F172A] dark:text-white leading-none mb-1">
                {user.name || "Anonymous"}
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                Answered {answer.created_at}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gray-900 dark:bg-bg-secondary-dark text-white flex items-center justify-center font-black text-xs shadow-sm border border-white/10 overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                (user.name && user.name[0]) || "U"
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
