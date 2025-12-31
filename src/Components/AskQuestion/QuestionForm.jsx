import React, { useState } from "react";
import { Eye, Edit3 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { QuestionTypeDropdown } from "./QuestionTypeDropdown";
import { TagInput } from "./TagInput";
import { WhereToPost } from "./WhereToPost";
// استيراد المكون السحري بتاعك
import { MarkdownWriteEditor } from "../WriteComponents/MarkdownWriteEditor";

export function QuestionForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [activeTab, setActiveTab] = useState("edit"); // 'edit' | 'preview'
  const [selectedType, setSelectedType] = useState("troubleshooting");
  const [selectedPostLocation, setSelectedPostLocation] = useState("staging");

  const getTitleQuality = () => {
    if (!title.length) return null;
    if (title.length < 15) return { label: "Too short", color: "text-red-500" };
    if (title.length < 40) return { label: "Fair", color: "text-orange-500" };
    if (title.length < 80) return { label: "Good", color: "text-green-500" };
    return { label: "Excellent", color: "text-emerald-500" };
  };

  const quality = getTitleQuality();

  const handlePostNow = () => {
    if (body.length < 20) {
      toast.error("Please explain your question in more detail.");
      return;
    }
    toast.success("Question posted on DevHub!");
  };

  const handleSubmitReview = () => {
    toast.success("Submitted to Staging Ground for feedback.");
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
        {/* نوع السؤال */}
        <Card>
          <SectionHeader
            title="Question type"
            helper="This helps others quickly understand what kind of help you need."
          />
          <QuestionTypeDropdown
            value={selectedType}
            onChange={setSelectedType}
          />
        </Card>

        {/* العنوان */}
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
              placeholder="e.g. React useEffect runs in an infinite loop..."
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

        {/* البودي (المحرر الجديد) */}
        <Card>
          <SectionHeader
            title="Body"
            helper="Include all the details someone would need to answer your question."
          />

          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Body <span className="text-red-500">*</span>
            </label>

            {/* أزرار التبديل بنفس ستايل صفحة الرايت */}
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

          {/* استخدام المحرر المتطور */}
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

        {/* التاجز */}
        <Card>
          <SectionHeader
            title="Tags"
            helper="Add up to 5 tags to describe the technologies."
          />
          <TagInput />
        </Card>

        {/* مكان البوست */}
        <Card>
          <SectionHeader
            title="Where to post"
            helper="Staging Ground for feedback or Public for everyone."
          />
          <WhereToPost
            value={selectedPostLocation}
            onChange={setSelectedPostLocation}
          />
        </Card>

        {/* الأزرار النهائية */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button className="text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors">
            Discard draft
          </button>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePostNow}
              className="w-full sm:w-auto px-8 py-3 border-2 border-primary text-primary dark:border-text-dark dark:text-text-dark rounded-full font-bold hover:bg-primary/5 transition-all"
            >
              Post question now
            </button>
            <button
              type="button"
              onClick={handleSubmitReview}
              className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-full font-bold hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
            >
              Submit to review
            </button>
          </div>
        </div>
      </div>
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
