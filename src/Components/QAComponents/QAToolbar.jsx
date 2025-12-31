// src/Components/QAComponents/QAToolbar.jsx
import React from "react";
import { SlidersHorizontal } from "lucide-react";

export function QAToolbar({
  activeTab,
  setActiveTab,
  filterOpen,
  setFilterOpen,
}) {
  const tabs = ["Newest", "Active", "Unanswered"];

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2 md:px-4 py-2 rounded-full transition-all ${
              activeTab === tab
                ? "bg-primary text-white shadow-md relative before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-12 before:h-0.5 before:bg-text-dark before:blur-sm"
                : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className={`px-3 md:px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
          filterOpen
            ? "bg-primary text-white"
            : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filter
      </button>
    </div>
  );
}
