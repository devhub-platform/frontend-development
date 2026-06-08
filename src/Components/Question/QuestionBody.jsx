// src/Components/Question/QuestionBody.jsx
import React from "react";
import MDEditor from "@uiw/react-md-editor";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom"; // 🔴 استيراد الـ Link للـ Navigation

export function QuestionBody({ question }) {
  const bodyText = question.content || "";
  const tags = question.tags || [];
  const user = question.user || {};
  const images = question.images || [];

  return (
    <div className="w-full" data-color-mode="light">
      {/* Markdown Body */}
      <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert text-[#475569] dark:text-gray-300 mb-6 leading-relaxed">
        {bodyText?.trim() ? (
          <MDEditor.Markdown
            source={bodyText}
            previewOptions={{
              remarkPlugins: [remarkGfm],
            }}
            style={{
              backgroundColor: "transparent",
              color: "inherit",
            }}
          />
        ) : (
          <p className="text-gray-400 dark:text-gray-500">
            No description provided for this question.
          </p>
        )}
      </div>

      {/* Images gallery */}
      {images.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Attached images
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {images.map((img) => (
              <a
                key={img.id}
                href={img.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-bg-secondary-dark"
              >
                <img
                  src={img.url}
                  alt={img.file_id || "Question image"}
                  className="w-full h-40 object-cover group-hover:scale-[1.02] transition-transform"
                />
                <div className="px-3 py-2 text-[11px] text-gray-600 dark:text-gray-300 truncate">
                  {img.file_id || "View image"}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Tags & Meta Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-50 dark:border-gray-700 pt-6">
        <div className="flex flex-wrap gap-2">
          {/* 🔴 تحويل التاج إلى Link تفاعلي يوجه لصفحة الأسئلة المفلترة */}
          {tags.map((tag, index) => (
            <Link
              key={index}
              to={`/questions/tag/${tag.name}`}
              className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-600 text-[10px] font-bold uppercase tracking-wider text-primary dark:text-text-dark hover:bg-primary/10 dark:hover:bg-bg-primary-dark transition-all inline-block"
            >
              #{tag.name}
            </Link>
          ))}
          {tags.length === 0 && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              No tags added for this question.
            </span>
          )}
        </div>

        {/* Owner Info */}
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-bg-primary-dark px-3 py-2 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-[0_0_18px_rgba(15,23,42,0.6)]">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-primary to-text-light flex items-center justify-center text-white text-[10px] font-black shadow-sm overflow-hidden">
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
          <div className="flex flex-col">
            <span className="text-[14px] font-black text-[#0F172A] dark:text-white leading-none">
              {user.name || "Anonymous"}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-1">
              Asked {question.created_at}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
