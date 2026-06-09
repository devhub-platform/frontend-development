/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  ArrowBigUp,
  ArrowBigDown,
  CheckCircle2,
  Share2,
  Edit3,
  Trash2,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import remarkGfm from "remark-gfm";
import { MarkdownWriteEditor } from "../WriteComponents/MarkdownWriteEditor";
import axiosInstance from "../../config/api";
import toast from "react-hot-toast";

export function AnswersList({ answers, questionId, onAnswersUpdate }) {
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 🔴 جلب الـ ID بتاع اليوزر الحالي من الـ Local Storage وتحويله لـ Number فوراً
  const storedUserRaw = localStorage.getItem("user");
  let currentUserId = null;

  if (storedUserRaw) {
    try {
      const parsedUser = JSON.parse(storedUserRaw);
      if (parsedUser && parsedUser.id) {
        currentUserId = Number(parsedUser.id); // تحويل رقمي صريح لضمان دقة المقارنة
      }
    } catch (e) {
      console.error("Failed to parse stored user json", e);
    }
  }

  const handleDeleteAnswer = async () => {
    if (!deleteTargetId) return;
    try {
      setIsDeleting(true);
      const res = await axiosInstance.delete(
        `/questions/${questionId}/answers/${deleteTargetId}`,
      );
      if (res.data?.success) {
        toast.success(res.data.message || "Answer deleted successfully");
        if (onAnswersUpdate) {
          onAnswersUpdate(
            answers.filter((a) => a.id !== deleteTargetId),
            -1,
          );
        }
        setDeleteTargetId(null);
      }
    } catch (err) {
      toast.error("Failed to delete the answer.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!answers || answers.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 dark:bg-bg-primary-dark rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">
          No answers yet. Share your knowledge!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {answers.map((answer) => (
        <AnswerCard
          key={answer.id}
          answer={answer}
          questionId={questionId}
          currentUserId={currentUserId}
          allAnswers={answers}
          onAnswersUpdate={onAnswersUpdate}
          onTriggerDelete={(id) => setDeleteTargetId(id)}
        />
      ))}

      {/* مودال تأكيد الحذف */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteTargetId(null)}
          />
          <div className="relative z-50 max-w-md w-full bg-white dark:bg-bg-secondary-dark rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 animate-fadeIn text-gray-900 dark:text-white">
            <div className="flex items-center gap-3 text-red-500 dark:text-red-400 mb-4">
              <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Delete Answer?</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this response? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-bg-primary-dark rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteAnswer}
                className="px-5 py-2 text-sm font-bold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnswerCard({
  answer,
  questionId,
  currentUserId,
  allAnswers,
  onAnswersUpdate,
  onTriggerDelete,
}) {
  const [score, setScore] = React.useState(answer.vote_score ?? 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(answer.content || "");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const user = answer.user || {};

  // 🔴 🔴 المقارنة الرقمية الصريحة والديناميكية بين السيرفر والـ Local Storage:
  const isOwner = currentUserId && user.id && Number(user.id) === currentUserId;

  const acceptedClasses = answer.is_accepted
    ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
    : "";

  const handleSaveEdit = async () => {
    if (!editBody.trim()) return;
    try {
      setIsSavingEdit(true);
      const res = await axiosInstance.put(
        `/questions/${questionId}/answers/${answer.id}`,
        {
          content: editBody.trim(),
        },
      );
      if (res.data?.success) {
        toast.success(res.data.message || "Answer updated successfully! 🎉");
        setIsEditing(false);

        const updatedAnswers = allAnswers.map((a) =>
          a.id === answer.id ? { ...a, content: editBody.trim() } : a,
        );
        if (onAnswersUpdate) onAnswersUpdate(updatedAnswers, 0);
      }
    } catch (err) {
      toast.error("Failed to update answer.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <article
      className={`relative p-6 sm:p-8 rounded-4xl border transition-all 
      border-gray-200 dark:border-gray-700 
      bg-white dark:bg-bg-primary-dark shadow-sm ${acceptedClasses}`}
    >
      {answer.is_accepted && (
        <div className="absolute top-0 right-10 px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-b-2xl flex items-center gap-1.5 shadow-md z-10">
          <CheckCircle2 className="w-3.5 h-3.5" /> Solution Accepted
        </div>
      )}

      <div className="flex flex-col w-full">
        {/* حالة التعديل Inline */}
        {isEditing ? (
          <div className="mb-4 space-y-3">
            <MarkdownWriteEditor
              value={editBody}
              onChange={setEditBody}
              mode="write"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={handleSaveEdit}
                disabled={isSavingEdit || !editBody.trim()}
                className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-emerald-600 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />{" "}
                {isSavingEdit ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditBody(answer.content);
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          /* حالة العرض العادية بالـ Markdown */
          <div
            className="prose prose-sm max-w-none dark:prose-invert text-[#475569] dark:text-gray-300 mb-8 leading-relaxed"
            data-color-mode="light"
          >
            <MDEditor.Markdown
              source={answer.content || ""}
              previewOptions={{ remarkPlugins: [remarkGfm] }}
              style={{ backgroundColor: "transparent", color: "inherit" }}
            />
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {/* Vote group */}
            <div className="flex items-center bg-gray-50 dark:bg-bg-secondary-dark p-1 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <button
                onClick={() => setScore((s) => s + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-primary hover:text-white transition-all text-gray-400 cursor-pointer"
              >
                <ArrowBigUp className="w-6 h-6" />
              </button>
              <span className="px-3 text-sm font-black text-[#0F172A] dark:text-white">
                {score}
              </span>
              <button
                onClick={() => setScore((s) => s - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500 hover:text-white transition-all text-gray-400 cursor-pointer"
              >
                <ArrowBigDown className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center gap-1">

              {/* 🔴 زرار التعديل والدليت هيظهروا ديناميكياً لكل مستخدم على إجاباته الخاصة فقط */}
              {isOwner && !isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2.5 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                    title="Edit Answer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onTriggerDelete(answer.id)}
                    className="p-2.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Delete Answer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center gap-3 pr-2">
            <div className="text-right">
              <p className="text-[13px] font-black text-[#0F172A] dark:text-white leading-none mb-1">
                {user.name || "Anonymous"}
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                Answered {answer.created_at}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gray-900 dark:bg-bg-secondary-dark text-white flex items-center justify-center font-black text-xs shadow-sm border border-white/10 overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                (user.name && user.name[0]) || "U"
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
