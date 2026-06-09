import React, { useState } from "react";
import { Eye, Edit3, Loader2 } from "lucide-react";
import { MarkdownWriteEditor } from "../WriteComponents/MarkdownWriteEditor";
import { createAnswer } from "../../services/qaApi"; // 🔴 استيراد الـ API الحقيقي
import toast from "react-hot-toast";

export function AnswerEditor({ questionId, onAnswerSuccess }) {
  const [body, setBody] = useState("");
  const [mode, setMode] = useState("write"); // "write" | "preview"
  const [isSubmitting, setIsSubmitting] = useState(false); // ستيت للـ Loader أثناء الرفع

  // 🔴 ربط الدالة بالـ API الحقيقي بدل الـ console.log القديم
  const handleSubmit = async () => {
    if (!body.trim()) {
      toast.error("Answer content cannot be empty.");
      return;
    }

    // مخررجس
    try {
      setIsSubmitting(true);
      const res = await createAnswer(questionId, body.trim());

      if (res?.success) {
        toast.success(res.message || "Answer posted successfully! 🎉");
        setBody(""); // تصفير الـ Editor بعد النجاح
        setMode("write");

        // تحديث قائمة الإجابات في الصفحة فوراً بدون ريفريش
        if (onAnswerSuccess && res.data) {
          onAnswerSuccess(res.data);
        }
      }
    } catch (err) {
      console.error("Submit answer error:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to post your answer. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex bg-gray-100 dark:bg-bg-primary-dark p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
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
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
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

      <div className="mt-4 flex justify-between items-center gap-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Use Markdown to format your answer. Include code and explanation.
        </p>
        <button
          type="button"
          disabled={isSubmitting || !body.trim()}
          onClick={handleSubmit}
          className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-text-light transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Posting..." : "Post Your Answer"}
        </button>
      </div>
    </div>
  );
}
