import React, { useState } from "react";

import { ChevronDown } from "lucide-react";

const questionTypes = [
  { value: "troubleshooting", label: "Troubleshooting / Debugging" },

  { value: "conceptual", label: "Conceptual / Explanation" },

  { value: "code-review", label: "Code review" },

  { value: "best-practices", label: "Best practices" },

  { value: "architecture", label: "Architecture / Design" },
];

export function QuestionTypeDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = questionTypes.find((t) => t.value === value);

  return (
    <div>
      <label
        htmlFor="question-type"
        className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
      >
        Type
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="w-full px-4 py-3 bg-white dark:bg-bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg text-left text-gray-900 dark:text-white flex items-center justify-between hover:border-text-light dark:hover:border-text-dark transition-colors"
        >
          <span>{selectedOption?.label || "Select a type"}</span>

          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            <div className="absolute z-20 w-full mt-2 bg-white dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
              {questionTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    onChange(type.value);

                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    type.value === value
                      ? "bg-primary/10 dark:bg-text-dark/10 text-primary dark:text-text-dark"
                      : "text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-bg-secondary-dark"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
