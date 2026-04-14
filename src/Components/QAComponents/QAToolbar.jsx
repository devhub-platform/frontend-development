import React from "react";

export function QAToolbar({ activeTab, setActiveTab }) {
  const tabs = [
    "Newest",
    "Highest Score",
    "Most Viewed",
    "Trending",
    "Unanswered",
  ];

  return (
    <div className="flex items-center justify-start gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
            activeTab === tab
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
