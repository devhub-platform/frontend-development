/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

const SUGGESTED_TAGS = [
  "javascript",
  "typescript",
  "react",
  "vue",
  "angular",
  "nodejs",
  "python",
  "webdev",
  "beginners",
  "tutorial",
  "devops",
  "css",
  "html",
  "github",
  "programming",
  "career",
  "productivity",
  "discuss",
  "cloud",
  "database",
];

export default function TagInput({ selectedTags, onTagsChange }) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filteredTags, setFilteredTags] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputValue) {
      const filtered = SUGGESTED_TAGS.filter(
        (tag) =>
          tag.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedTags.includes(tag)
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(
        SUGGESTED_TAGS.filter((tag) => !selectedTags.includes(tag)).slice(0, 8)
      );
    }
  }, [inputValue, selectedTags]);

  const handleAddTag = (tag) => {
    if (selectedTags.length < 4 && !selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
      setInputValue("");
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      if (filteredTags.length > 0) handleAddTag(filteredTags[0]);
      else handleAddTag(inputValue.toLowerCase());
    } else if (
      e.key === "Backspace" &&
      !inputValue &&
      selectedTags.length > 0
    ) {
      handleRemoveTag(selectedTags[selectedTags.length - 1]);
    }
  };

  return (
    <div className="mb-6 relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="
                inline-flex items-center gap-1 px-3 py-1 rounded-full
                bg-gray-100 text-[#475569]
                dark:bg-bg-secondary-dark dark:text-gray-200
              "
            style={{ fontWeight: 600 }}
          >
            #{tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-red-600 transition-colors"
              title="Remove tag"
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>
      <div>
        {selectedTags.length < 4 && (
          <input
            ref={inputRef}
            type="text"
            placeholder={selectedTags.length === 0 ? "Add up to 4 tags..." : ""}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={handleKeyDown}
            disabled={selectedTags.length >= 4}
            className="
            w-full outline-none bg-transparent
            text-[#0F172A] placeholder-gray-400
            disabled:cursor-not-allowed
            dark:text-white dark:placeholder-gray-500
            border border-gray-200 rounded-lg p-3
          focus-within:border-primary transition-all
          dark:bg-bg-primary-dark dark:border-gray-700
          "
          />
        )}
      </div>

      {/* Tag Suggestions Dropdown */}
      {isFocused && selectedTags.length < 4 && filteredTags.length > 0 && (
        <div
          className="
            absolute top-full left-0 right-0 mt-2
            bg-white border border-gray-200 rounded-lg shadow-lg
            z-200 max-h-64 overflow-y-auto
            dark:bg-bg-primary-dark dark:border-gray-700
          "
        >
          {filteredTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleAddTag(tag)}
              className="
                w-full text-left px-4 py-2 transition-colors
                hover:bg-gray-50
                dark:hover:bg-bg-secondary-dark
              "
            >
              <span className="text-[#475569] dark:text-gray-200">#{tag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
