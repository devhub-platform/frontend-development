// src/Components/QAComponents/Sidebar.jsx
import React from "react";
import { Filter, Tag, EyeOff, Flame, X } from "lucide-react";

export default function Sidebar({
  watchedTags,
  setWatchedTags,
  ignoredTags,
  setIgnoredTags,
  ignoreMode,
  setIgnoreMode,
  hotQuestions,
  savedFilters,
  setSavedFilters,
  onApplySavedFilter,
  onEditFilter,
  onCreateFilter,
}) {
  const [watchedInput, setWatchedInput] = React.useState("");
  const [ignoredInput, setIgnoredInput] = React.useState("");
  const [isEditingWatched, setIsEditingWatched] = React.useState(false);
  const [isEditingIgnored, setIsEditingIgnored] = React.useState(false);

  const addWatchedTag = () => {
    const value = watchedInput.trim();
    if (value && !watchedTags.includes(value)) {
      setWatchedTags([...watchedTags, value]);
    }
    setWatchedInput("");
  };

  const addIgnoredTag = () => {
    const value = ignoredInput.trim();
    if (value && !ignoredTags.includes(value)) {
      setIgnoredTags([...ignoredTags, value]);
    }
    setIgnoredInput("");
  };

  const removeWatchedTag = (tag) => {
    setWatchedTags(watchedTags.filter((t) => t !== tag));
  };

  const removeIgnoredTag = (tag) => {
    setIgnoredTags(ignoredTags.filter((t) => t !== tag));
  };

  const handleWatchedBlur = () => {
    if (!watchedInput.trim()) {
      setIsEditingWatched(false);
    }
  };

  const handleIgnoredBlur = () => {
    if (!ignoredInput.trim()) {
      setIsEditingIgnored(false);
    }
  };

  return (
    <aside className="space-y-4 sticky top-24">
      {/* Custom Filters */}
      <section className="bg-white dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-light dark:text-text-dark" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Custom Filters
            </h3>
          </div>
        </div>

        {savedFilters.length === 0 ? (
          <EmptyText text="Create a custom filter to quickly reuse your favorite settings." />
        ) : (
          <div className="space-y-1.5">
            {savedFilters.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-bg-secondary-dark transition-colors"
              >
                <button
                  onClick={() => onApplySavedFilter(filter)}
                  className="text-sm text-text-light dark:text-text-dark hover:underline text-left truncate"
                >
                  {filter.title}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditFilter(filter)}
                    className="text-xs text-gray-400 hover:text-primary"
                  >
                    edit
                  </button>
                  <button
                    onClick={() =>
                      setSavedFilters((prev) =>
                        prev.filter((f) => f.id !== filter.id)
                      )
                    }
                    className="text-xs text-gray-400 hover:text-red-500"
                  >
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onCreateFilter}
          className="mt-3 text-sm text-primary dark:text-text-dark hover:underline"
        >
          Create a custom filter
        </button>
      </section>

      {/* Watched Tags */}
      <section className="bg-white dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <HeaderWithEdit
          title="Watched Tags"
          isEditing={isEditingWatched}
          onToggle={() => setIsEditingWatched((v) => !v)}
          hasContent={watchedTags.length > 0}
        />

        <TagList
          tags={watchedTags}
          variant="primary"
          onRemove={removeWatchedTag}
        />

        {watchedTags.length === 0 && !isEditingWatched ? (
          <button
            onClick={() => setIsEditingWatched(true)}
            className="mt-2 w-full px-3 py-2 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-bg-secondary-dark transition-colors flex items-center justify-center gap-1"
          >
            <Tag className="w-3 h-3" />
            Add watched tag
          </button>
        ) : (
          isEditingWatched && (
            <TagInputRow
              placeholder="Add tag..."
              value={watchedInput}
              onChange={setWatchedInput}
              onAdd={addWatchedTag}
              onBlur={handleWatchedBlur}
            />
          )
        )}
      </section>

      {/* Ignored Tags */}
      <section className="bg-white dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <HeaderWithEdit
          title="Ignored Tags"
          isEditing={isEditingIgnored}
          onToggle={() => setIsEditingIgnored((v) => !v)}
          hasContent={ignoredTags.length > 0}
        />

        <TagList
          tags={ignoredTags}
          variant="muted"
          onRemove={removeIgnoredTag}
        />

        {ignoredTags.length === 0 && !isEditingIgnored ? (
          <button
            onClick={() => setIsEditingIgnored(true)}
            className="mt-2 w-full px-3 py-2 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-bg-secondary-dark transition-colors flex items-center justify-center gap-1"
          >
            <EyeOff className="w-3 h-3" />
            Add ignored tag
          </button>
        ) : (
          isEditingIgnored && (
            <>
              <TagInputRow
                placeholder="Add tag..."
                value={ignoredInput}
                onChange={setIgnoredInput}
                onAdd={addIgnoredTag}
                secondary
                onBlur={handleIgnoredBlur}
              />

              <div className="mt-3 space-y-2">
                <RadioRow
                  label="Hide questions in your ignored tags"
                  checked={ignoreMode === "hide"}
                  onChange={() => setIgnoreMode("hide")}
                />
                <RadioRow
                  label="Gray out questions in your ignored tags"
                  checked={ignoreMode === "gray"}
                  onChange={() => setIgnoreMode("gray")}
                />
              </div>
            </>
          )
        )}
      </section>

      {/* Hot Questions */}
      <section className="bg-white dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Hot Questions
          </h3>
        </div>

        <div className="space-y-3">
          {hotQuestions.map((q) => (
            <div key={q.id} className="flex items-start gap-2 group">
              <Flame className="w-3 h-3 text-orange-400 mt-1 shrink-0" />
              <span className="text-sm text-text-light dark:text-text-dark group-hover:underline line-clamp-2">
                {q.title}
              </span>
            </div>
          ))}
        </div>

        <button className="mt-3 text-sm text-primary dark:text-text-dark hover:underline">
          More hot questions →
        </button>
      </section>
    </aside>
  );
}

/* ========== small sub components ========== */

function HeaderWithEdit({ title, isEditing, onToggle, hasContent }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      {hasContent && (
        <button
          onClick={onToggle}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          {isEditing ? "done" : "edit"}
        </button>
      )}
    </div>
  );
}

function EmptyText({ text }) {
  return (
    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
      {text}
    </p>
  );
}

function TagList({ tags, variant, onRemove }) {
  if (tags.length === 0) return null;

  const base = "px-3 py-1 rounded-full text-sm flex items-center gap-2 border";
  const styles =
    variant === "primary"
      ? "bg-text-dark/10 border-text-dark/30 text-primary dark:text-text-dark"
      : "bg-gray-100 dark:bg-bg-secondary-dark border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300";

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {tags.map((tag) => (
        <span key={tag} className={`${base} ${styles}`}>
          {tag}
          {onRemove && (
            <button
              onClick={() => onRemove(tag)}
              className="hover:bg-red-500/20 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}
    </div>
  );
}

function TagInputRow({
  placeholder,
  value,
  onChange,
  onAdd,
  secondary,
  onBlur,
}) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAdd()}
        onBlur={onBlur}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-text-light"
      />
      <button
        onClick={onAdd}
        className={`px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
          secondary
            ? "bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500"
            : "bg-primary hover:bg-text-light"
        }`}
      >
        Add
      </button>
    </div>
  );
}

function RadioRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 border-gray-300 accent-primary focus:ring-text-light"
      />
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  );
}
