import React from "react";
import { Flame } from "lucide-react";
import { Link } from "react-router-dom";

export function Sidebar({ hotQuestions, onViewMoreHot }) {
  return (
    <div className="space-y-6">
      <section
        aria-label="Hot questions"
        className="bg-white dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Hot Questions
          </h3>
        </div>

        <ul className="space-y-2">
          {hotQuestions && hotQuestions.length > 0 ? (
            hotQuestions.map((q) => (
              <li key={q.id} className="flex items-start gap-2 group">
                <Flame className="w-3 h-3 text-orange-400 mt-1 shrink-0" />
                <Link
                  to={`/questions/${q.slug}`}
                  className="block text-sm text-text-light dark:text-text-dark group-hover:underline line-clamp-2 transition-colors"
                >
                  {q.title}
                </Link>
              </li>
            ))
          ) : (
            <li className="text-xs text-gray-500 dark:text-gray-400 italic">
              No hot questions yet.
            </li>
          )}
        </ul>

        <button
          onClick={onViewMoreHot}
          className="mt-4 w-full text-center py-2 text-xs font-bold text-primary dark:text-text-dark bg-primary/5 dark:bg-text-dark/5 rounded-lg hover:bg-primary hover:text-white dark:hover:bg-text-dark dark:hover:text-bg-primary-dark transition-all duration-300"
        >
          Explore All Trending Questions →
        </button>
      </section>
    </div>
  );
}
