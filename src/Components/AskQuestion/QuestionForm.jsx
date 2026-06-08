// src/Components/AskQuestion/QuestionForm.jsx
import React, { useEffect, useState } from "react";
import {
  Eye,
  Edit3,
  Image as ImageIcon,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { TagInput } from "./TagInput";
import { MarkdownWriteEditor } from "../WriteComponents/MarkdownWriteEditor";
import { createQuestion } from "../../services/qaApi";

const DRAFT_KEY = "askQuestionDraft";

export function QuestionForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [activeTab, setActiveTab] = useState("edit"); // 'edit' | 'preview'
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]); // File[]
  const [submitting, setSubmitting] = useState(false);

  // 🔴 ستيتس مضافة لشاشة التكبير ومودال الحذف الجديد
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const navigate = useNavigate();

  // -------- 1) Load draft from localStorage on mount --------
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.title) setTitle(parsed.title);
      if (parsed.body) setBody(parsed.body);
      if (parsed.tags && Array.isArray(parsed.tags)) setTags(parsed.tags);
    } catch (e) {
      console.error("Failed to parse draft", e);
    }
  }, []);

  // -------- 2) Save draft on changes (title/body/tags) --------
  useEffect(() => {
    const draft = {
      title,
      body,
      tags,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [title, body, tags]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setTitle("");
    setBody("");
    setTags([]);
    setImages([]);
  };

  const getTitleQuality = () => {
    if (!title.length) return null;
    if (title.length < 15) return { label: "Too short", color: "text-red-500" };
    if (title.length < 40) return { label: "Fair", color: "text-orange-500" };
    if (title.length < 80) return { label: "Good", color: "text-green-500" };
    return { label: "Excellent", color: "text-emerald-500" };
  };

  const quality = getTitleQuality();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleRemoveImage = (index, e) => {
    e.stopPropagation(); // يمنع فتح التكبير عند حذف الصورة
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!title.trim()) {
      toast.error("Title is required.");
      return false;
    }
    if (!body.trim() || body.trim().length < 20) {
      toast.error(
        "Please explain your question in more detail (at least 20 characters).",
      );
      return false;
    }
    if (tags.length === 0) {
      toast.error("Please add at least one tag.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        content: body,
        tags,
        images,
      };

      const res = await createQuestion(payload);
      toast.success(res.message || "Question created successfully!");

      clearDraft();

      const newId = res.data?.id;
      if (newId) {
        setTimeout(() => {
          navigate(`/questions/${newId}`);
        }, 800);
      }
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors || {};
        const firstKey = Object.keys(errors)[0];
        toast.error(errors[firstKey]?.[0] || "Validation failed.");
      } else if (err.response?.status === 401) {
        toast.error("You must be logged in to ask a question.");
      } else {
        toast.error(
          err.response?.data?.message ||
            "Failed to create question. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDiscard = () => {
    if (!title && !body && tags.length === 0 && images.length === 0) {
      return;
    }
    // 🔴 بنفتح المودال الجديد الشيك بدل الـ window.confirm الافتراضي
    setShowDiscardModal(true);
  };

  const confirmDiscard = () => {
    clearDraft();
    setShowDiscardModal(false);
    toast.success("Draft cleared successfully!");
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-text)",
            border: "1px solid var(--toast-border)",
            borderRadius: "12px",
            padding: "12px 14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            maxWidth: "420px",
            width: "100%",
          },
          success: {
            iconTheme: { primary: "var(--color-primary)", secondary: "white" },
            style: { border: "1px solid rgba(0,56,144,0.25)" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "white" },
          },
        }}
      />

      <div className="space-y-5">
        {/* Title Card */}
        <Card>
          <SectionHeader
            title="Title"
            helper="Summarize the problem in one short, clear sentence."
          />
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to use Laravel queues with jobs and workers?"
              className="w-full px-4 py-3 bg-white dark:bg-bg-primary-dark border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
            />
            {quality && (
              <div
                className={`absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-[11px] font-semibold ${quality.color} bg-gray-50 dark:bg-[#020617]`}
              >
                {quality.label}
              </div>
            )}
          </div>
        </Card>

        {/* Body Card */}
        <Card>
          <SectionHeader
            title="Body"
            helper="Include all the details someone would need to answer your question."
          />

          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Body <span className="text-red-500">*</span>
            </label>

            <div className="flex bg-gray-100 dark:bg-bg-primary-dark p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === "edit"
                    ? "bg-white dark:bg-bg-secondary-dark text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === "preview"
                    ? "bg-white dark:bg-bg-secondary-dark text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Eye className="w-4 h-4" /> Preview
              </button>
            </div>
          </div>

          <MarkdownWriteEditor
            value={body}
            onChange={setBody}
            mode={activeTab === "edit" ? "write" : "preview"}
          />

          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>Minimum 220 characters recommended for better answers.</span>
            <span
              className={
                body.length < 220 ? "text-orange-500" : "text-green-500"
              }
            >
              {body.length} characters
            </span>
          </div>
        </Card>

        {/* Images Card */}
        <Card>
          <SectionHeader
            title="Images"
            helper="Attach screenshots or diagrams that help explain your problem."
          />
          <div className="flex flex-col gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary dark:hover:border-text-dark hover:bg-primary/5 dark:hover:bg-text-dark/10 transition-colors w-fit">
              <ImageIcon className="w-4 h-4 text-primary dark:text-text-dark" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Upload images
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((file, index) => {
                  const objectUrl = URL.createObjectURL(file);
                  return (
                    <div
                      key={index}
                      onClick={() => setActiveLightboxImage(objectUrl)}
                      className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-bg-primary-dark cursor-zoom-in"
                    >
                      <img
                        src={objectUrl}
                        alt={file.name}
                        className="w-full h-28 object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => handleRemoveImage(index, e)}
                        className="absolute top-1 right-1 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="px-2 py-1 text-[10px] text-gray-600 dark:text-gray-300 truncate bg-white/80 dark:bg-bg-primary-dark/80">
                        {file.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {images.length === 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You can optionally attach multiple images. Max size per file
                depends on server limits.
              </p>
            )}
          </div>
        </Card>

        {/* Tags Card */}
        <Card>
          <SectionHeader
            title="Tags"
            helper="Add up to 5 tags to describe the technologies."
          />
          <TagInput value={tags} onChange={setTags} />
        </Card>

        {/* Bottom Bar Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={handleDiscard}
            className="text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            Discard draft
          </button>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-full font-bold hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? "Posting..." : "Post your question"}
            </button>
          </div>
        </div>
      </div>

      {/* 🔴 أولاً: شاشة التكبير Lightbox لعرض صور الأسئلة بكامل حجمها ووضوحها */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-200 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveLightboxImage(null)}
        >
          <button
            type="button"
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
            onClick={() => setActiveLightboxImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeLightboxImage}
            alt="Large Attachment Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl scale-100"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* 🔴 ثانياً: الـ Custom Confirmation Modal الشيك جداً كبديل للـ window.confirm الافتراضي */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDiscardModal(false)}
          />
          <div className="relative z-50 max-w-md w-full bg-white dark:bg-bg-secondary-dark rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 transform transition-all scale-100 animate-fadeIn">
            <div className="flex items-center gap-3 text-red-500 dark:text-red-400 mb-4">
              <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Discard Draft?
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Are you sure you want to discard your current question draft? This
              action will permanently clear all typed information, tags, and
              attached images.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDiscardModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-bg-primary-dark rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDiscard}
                className="px-5 py-2 text-sm font-bold bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-md shadow-red-500/20 transition-all cursor-pointer"
              >
                Discard Content
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Helpers */
function Card({ children }) {
  return (
    <section className="bg-white dark:bg-bg-secondary-dark rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
      {children}
    </section>
  );
}

function SectionHeader({ title, helper }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-extrabold text-[#0F172A] dark:text-white uppercase tracking-wide">
        {title}
      </h2>
      {helper && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helper}
        </p>
      )}
    </div>
  );
}
