import React, { useState } from "react";
import { Eye, Edit3 } from "lucide-react";
import { MarkdownWriteEditor } from "../WriteComponents/MarkdownWriteEditor";

export function AnswerEditor() {
  const [body, setBody] = useState("");
  const [mode, setMode] = useState("write"); // "write" | "preview"

  const handleSubmit = () => {
    if (!body.trim()) return;
    console.log("Answer submitted:", body);
    setBody("");
    setMode("write");
  };

  return (
    <div className="bg-white dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex bg-gray-100 dark:bg-bg-primary-dark p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
              mode === "write"
                ? "bg-white dark:bg-bg-secondary-dark text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Edit3 className="w-4 h-4" /> Edit
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
              mode === "preview"
                ? "bg-white dark:bg-bg-secondary-dark text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>
      </div>

      <MarkdownWriteEditor value={body} onChange={setBody} mode={mode} />

      <div className="mt-4 flex justify-between items-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Use Markdown to format your answer. Include code and explanation.
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-text-light transition-colors"
        >
          Post Your Answer
        </button>
      </div>
    </div>
  );
}
