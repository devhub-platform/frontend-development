import React, { useState } from "react";
import { X } from "lucide-react";

const suggestedTags = [
  "javascript",
  "reactjs",
  "typescript",
  "python",
  "nodejs",
  "css",
  "html",
  "api",
  "mongodb",
  "express",
];

export function TagInput() {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag) => {
    const value = tag.trim();
    if (!value) return;
    if (tags.length >= 5) return;
    if (tags.includes(value)) return;
    setTags([...tags, value]);
    setInputValue("");
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const filteredSuggestions = suggestedTags.filter(
    (tag) =>
      !tags.includes(tag) &&
      (inputValue ? tag.toLowerCase().includes(inputValue.toLowerCase()) : true)
  );

  return (
    <div>
      <label
        htmlFor="tags"
        className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
      >
        Tags <span className="text-red-500">*</span>
      </label>

      <div className="flex flex-wrap gap-2 p-3 bg-white dark:bg-bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-text-light focus-within:border-transparent">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 dark:bg-text-dark/10 text-primary dark:text-text-dark rounded-full text-sm font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-primary/20 dark:hover:bg-text-dark/20 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {tags.length < 5 && (
          <input
            id="tags"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? "e.g. css python-3.x node.js" : ""}
            className="flex-1 min-w-[180px] bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
        )}
      </div>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Add up to 5 tags to describe what your question is about. Press Enter or
        Space to add.
      </p>

      {inputValue && filteredSuggestions.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Suggested tags:
          </p>
          <div className="flex flex-wrap gap-2">
            {filteredSuggestions.slice(0, 6).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-bg-primary-dark text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-bg-secondary-dark hover:shadow-sm transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {!inputValue && tags.length === 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Popular tags:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.slice(0, 6).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-bg-primary-dark text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-bg-secondary-dark hover:shadow-sm transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
