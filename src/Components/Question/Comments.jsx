import React, { useState } from "react";

export function Comments({ initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [showBox, setShowBox] = useState(false);
  const [text, setText] = useState("");

  const handleAdd = () => {
    const value = text.trim();
    if (value.length < 3) return;

    const newComment = {
      id: crypto.randomUUID(),
      author: "You",
      timeAgo: "just now",
      body: value,
    };

    setComments((prev) => [...prev, newComment]);
    setText("");
    setShowBox(false);
  };

  return (
    <div className="mt-3">
      {comments.length > 0 && (
        <ul className="space-y-2 mb-2">
          {comments.map((c) => (
            <li
              key={c.id}
              className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 border-b border-dashed border-gray-200 dark:border-gray-700 pb-1"
            >
              {c.body}{" "}
              <span className="text-gray-500 dark:text-gray-400">
                — {c.author} · {c.timeAgo}
              </span>
            </li>
          ))}
        </ul>
      )}

      {!showBox && (
        <button
          type="button"
          onClick={() => setShowBox(true)}
          className="text-xs sm:text-sm text-primary dark:text-text-dark hover:underline"
        >
          Add a comment
        </button>
      )}

      {showBox && (
        <div className="mt-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-bg-primary-dark text-sm text-gray-900 dark:text-white resize-y focus:ring-2 focus:ring-text-light focus:border-transparent"
            placeholder="Use comments to ask for more information or suggest improvements."
          />
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-medium hover:bg-text-light transition-colors"
            >
              Comment
            </button>
            <button
              type="button"
              onClick={() => {
                setShowBox(false);
                setText("");
              }}
              className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
            >
              Cancel
            </button>
            <span className="ml-auto text-[11px] text-gray-400">
              Enter at least 3 characters
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
