// src/Components/QAComponents/QAHeader.jsx
import React from "react";
import { MessageSquarePlus } from "lucide-react";
import { Link } from "react-router-dom";

export function QAHeader({ total }) {
  return (
    <header className="mb-4 sm:mb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
            Questions
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {total.toLocaleString()} questions • Latest from the DevHub
            community
          </p>
        </div>

        <Link to="/ask" className="self-stretch sm:self-auto">
          <button className="w-full sm:w-auto justify-center group px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-primary text-white hover:bg-text-light transition-all shadow-md shadow-primary/30 hover:shadow-primary/50 flex items-center gap-2 text-sm sm:text-base">
            <MessageSquarePlus className="w-5 h-5" />
            Ask Question
          </button>
        </Link>
      </div>
    </header>
  );
}
