/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { X, RotateCcw } from "lucide-react";

export function FilterPanel({ onClose, values, onChange, onSaveCustom }) {
  const [selectedTags, setSelectedTags] = useState(values.filterTags || []);
  const [tagInput, setTagInput] = useState("");
  const [noAnswers, setNoAnswers] = useState(values.noAnswersOnly || false);
  const [unanswered, setUnanswered] = useState(values.unansweredOnly || false);
  const [sort, setSort] = useState(values.sortBy || "Newest");

  useEffect(() => {
    setSelectedTags(values.filterTags || []);
    setNoAnswers(values.noAnswersOnly || false);
    setUnanswered(values.unansweredOnly || false);
    setSort(values.sortBy || "Newest");
  }, [values]);

  const addTag = () => {
    const value = tagInput.trim();
    if (value && !selectedTags.includes(value)) {
      setSelectedTags([...selectedTags, value]);
    }
    setTagInput("");
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const reset = () => {
    setSelectedTags([]);
    setNoAnswers(false);
    setUnanswered(false);
    setSort("Newest");
  };

  const apply = () => {
    onChange({
      noAnswers,
      unanswered,
      sort,
      tags: selectedTags,
    });
    onClose();
  };

  const handleSaveCustom = () => {
    onSaveCustom();
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-full sm:w-96 bg-white dark:bg-bg-primary-dark rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.4)] border border-gray-200 dark:border-gray-700 p-4 sm:p-5 z-40">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Filters
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Refine the questions shown in your feed.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-bg-secondary-dark rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="space-y-5">
        {/* Filter by */}
        <Section title="Filter by">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={noAnswers}
              onChange={(e) => setNoAnswers(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-primary focus:ring-text-light"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              No answers
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={unanswered}
              onChange={(e) => setUnanswered(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-primary focus:ring-text-light"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Unanswered only
            </span>
          </label>
        </Section>

        {/* Sort by */}
        <Section title="Sort by">
          {["Newest", "Recent activity", "Highest score", "Trending"].map(
            (option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="sort"
                  checked={sort === option}
                  onChange={() => setSort(option)}
                  className="w-4 h-4 border-gray-300 accent-primary focus:ring-text-light"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option}
                </span>
              </label>
            )
          )}
        </Section>

        {/* Tagged with */}
        <Section title="Tagged with">
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-text-dark/10 border border-text-dark/30 text-primary dark:text-text-dark text-xs flex items-center gap-2"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:bg-primary/10 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag()}
              placeholder="Add tag..."
              className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-text-light"
            />
            <button
              onClick={addTag}
              className="px-3 py-2 rounded-lg bg-primary text-white text-xs sm:text-sm font-medium hover:bg-text-light transition-colors"
            >
              Add
            </button>
          </div>
        </Section>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleSaveCustom}
            className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-bg-secondary-dark transition-colors"
          >
            Save as custom
          </button>
          <button
            onClick={apply}
            className="px-4 py-2 rounded-full bg-primary text-white text-xs font-medium hover:bg-text-light transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
        {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
