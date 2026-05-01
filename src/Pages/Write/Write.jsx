/* eslint-disable no-unused-vars */
// src/pages/Write/Write.jsx (أو المسار اللي عندك)
import { useState } from "react";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import TagInput from "../../Components/WriteComponents/TagInput";
import { MarkdownWriteEditor } from "../../Components/WriteComponents/MarkdownWriteEditor";
import { AIAssistantModal } from "../../Components/WriteComponents/AIAssistantModal";
import { RightSidebar } from "../../Components/WriteComponents/RightSidebar";
import { ActionButtons } from "../../Components/WriteComponents/ActionButtons";
import toast, { Toaster } from "react-hot-toast";
import { Lightbulb, Settings, X, Image as ImageIcon } from "lucide-react";
import { createPost } from "../../services/postsApi";

export default function Write() {
  const [title, setTitle] = useLocalStorageState("devhub_write_title", "");
  const [selectedTags, setSelectedTags] = useLocalStorageState(
    "devhub_write_tags",
    [],
  );
  const [editorContent, setEditorContent] = useLocalStorageState(
    "devhub_write_md",
    "",
  );
  const [coverImagePreview, setCoverImagePreview] = useLocalStorageState(
    "devhub_write_cover_preview",
    null,
  );
  const [visibility] = useLocalStorageState(
    "devhub_write_visibility",
    "public",
  ); // لحد ما تستخدمها في الـ API (status/public/private)

  // ملف حقيقي للـ cover عشان الـ API
  const [coverImageFile, setCoverImageFile] = useState(null);

  const [editorMode, setEditorMode] = useState("edit"); // 'edit' | 'preview'
  const [showAIModal, setShowAIModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mobile drawer
  const [showMobileSettings, setShowMobileSettings] = useState(false);

  // NEW: صورة جوه البوست (غير الـ cover)
  const [postImagePreview, setPostImagePreview] = useState(null);
  const [postImageFile, setPostImageFile] = useState(null);

  const handlePostImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setPostImageFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev?.target?.result;
      if (typeof result === "string") setPostImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePostImage = () => {
    setPostImageFile(null);
    setPostImagePreview(null);
  };

  const validatePost = () => {
    if (!title.trim()) {
      toast.error("Please add a title for your post.");
      return false;
    }
    if (!editorContent.trim()) {
      toast.error("Post content cannot be empty.");
      return false;
    }
    if (selectedTags.length === 0) {
      toast.error("Please add at least one tag.");
      return false;
    }
    return true;
  };

  const handlePublish = async () => {
    if (!validatePost()) return;

    try {
      setIsPublishing(true);

      const payload = {
        title: title.trim(),
        content: editorContent,
        status: "published",
        // ممكن تحسبي read_time تقريبياً بعدين (عدد الكلمات / 200 مثلاً)
        read_time: undefined,
        tags: selectedTags,
        coverImageFile,
        imageFile: postImageFile,
      };

      const res = await createPost(payload);

      toast.success(res?.message || "Post published successfully!");

      // TODO: ممكن هنا تعملي navigation لصفحة البوست res.post.ID
      // أو تفرّغي الفورم:
      // setTitle("");
      // setSelectedTags([]);
      // setEditorContent("");
      // setCoverImagePreview(null);
      // setCoverImageFile(null);
      // setPostImagePreview(null);
      // setPostImageFile(null);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        "Failed to publish post. Please try again.";
      toast.error(msg);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!validatePost()) return;

    try {
      setIsSaving(true);

      const payload = {
        title: title.trim(),
        content: editorContent,
        status: "draft",
        read_time: undefined,
        tags: selectedTags,
        coverImageFile,
        imageFile: postImageFile,
      };

      const res = await createPost(payload);
      toast.success(res?.message || "Draft saved successfully!");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        "Failed to save draft. Please try again.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
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

      <div className="min-h-screen bg-slate-50 dark:bg-bg-secondary-dark transition-all duration-300">
        {/* Main container */}
        <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row gap-6">
            {/* Left/Center - Editor Area */}
            <div className="flex-1">
              <div className="max-w-225 mx-auto py-6 lg:py-8">
                {/* Title Input */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="New post title here..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="
                      w-full px-3 sm:px-4 py-3
                      text-3xl sm:text-4xl lg:text-5xl
                      border-none outline-none
                      bg-white text-black placeholder-gray-300
                      dark:bg-bg-primary-dark dark:text-white dark:placeholder-gray-500
                      transition-colors rounded-sm font-extrabold leading-[1.1]
                    "
                  />
                </div>

                {/* Tag Input */}
                <TagInput
                  selectedTags={selectedTags}
                  onTagsChange={setSelectedTags}
                />

                {/* Top actions row: AI + Mobile settings */}
                <div className="mb-6 flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => setShowAIModal(true)}
                    className="
                      inline-flex items-center gap-2 px-4 py-2
                      bg-primary text-white rounded-lg
                      hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 font-semibold cursor-pointer
                    "
                  >
                    <Lightbulb className="w-5 h-5" />
                    AI Assistant
                  </button>

                  {/* يظهر في الموبايل فقط */}
                  <button
                    type="button"
                    onClick={() => setShowMobileSettings(true)}
                    className="
                      lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-bg-primary-dark
                      border border-gray-200 text-[#0F172A] hover:bg-gray-50
                      dark:border-gray-700 dark:text-white dark:hover:bg-transparent
                      transition-colors cursor-pointer font-bold
                    "
                  >
                    <Settings className="w-5 h-5 text-primary dark:text-text-dark" />
                    Settings
                  </button>
                </div>

                {/* NEW: Post inner image (غير الـ cover) */}
                <div className="mb-6">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#475569] dark:text-gray-300">
                    <ImageIcon className="w-4 h-4" />
                    Image inside the post (optional)
                  </h3>

                  {postImagePreview ? (
                    <div className="relative group max-w-xl">
                      <img
                        src={postImagePreview}
                        alt="Post"
                        className="w-full max-h-72 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePostImage}
                        className="
                          absolute top-2 right-2 p-1.5 rounded-lg
                          bg-red-600 text-white text-xs
                          opacity-0 group-hover:opacity-100
                          transition-opacity
                        "
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label
                      className="
                        inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer
                        bg-white border border-dashed border-gray-300 text-[#475569]
                        hover:border-primary hover:text-primary hover:bg-slate-50
                        dark:bg-bg-primary-dark dark:border-gray-700 dark:text-gray-200
                        dark:hover:border-primary dark:hover:text-white
                        transition-colors text-sm font-medium
                      "
                    >
                      <ImageIcon className="w-4 h-4" />
                      Upload image for content
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePostImageUpload}
                      />
                    </label>
                  )}
                </div>

                {/* Editor Tabs */}
                <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setEditorMode("edit")}
                      className={`px-4 py-2 border-b-2 transition-colors font-semibold ${
                        editorMode === "edit"
                          ? "border-primary text-primary dark:text-text-dark"
                          : "border-transparent text-[#475569] hover:text-[#0F172A] dark:text-gray-400 dark:hover:text-white"
                      }`}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setEditorMode("preview")}
                      className={`px-4 py-2 border-b-2 transition-colors font-semibold ${
                        editorMode === "preview"
                          ? "border-primary text-primary dark:text-text-dark"
                          : "border-transparent text-[#475569] hover:text-[#0F172A] dark:text-gray-400 dark:hover:text-white"
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {/* Editor */}
                <MarkdownWriteEditor
                  value={editorContent}
                  onChange={setEditorContent}
                  mode={editorMode}
                />
              </div>
            </div>

            {/* Right Sidebar (Desktop فقط) */}
            <div className="hidden lg:block">
              <RightSidebar
                coverImagePreview={coverImagePreview}
                onCoverImagePreviewChange={setCoverImagePreview}
                onCoverFileChange={setCoverImageFile}
                variant="desktop"
              />
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {showMobileSettings && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowMobileSettings(false)}
            />
            <div
              className="
                absolute right-0 top-0 h-full w-[92%] max-w-sm
                bg-slate-50 dark:bg-bg-secondary-dark
                border-l border-gray-200 dark:border-gray-700
                overflow-y-auto dark-scrollbar
              "
            >
              <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                <h3
                  className="text-[#0F172A] dark:text-white"
                  style={{ fontWeight: 900 }}
                >
                  Post settings
                </h3>
                <button
                  type="button"
                  onClick={() => setShowMobileSettings(false)}
                  className="
                    p-2 rounded-lg
                    hover:bg-gray-100 dark:hover:bg-bg-primary-dark
                    transition-colors
                  "
                  title="Close"
                >
                  <X className="w-6 h-6 text-[#475569] dark:text-gray-200" />
                </button>
              </div>

              <div className="p-4">
                <RightSidebar
                  coverImagePreview={coverImagePreview}
                  onCoverImagePreviewChange={setCoverImagePreview}
                  onCoverFileChange={setCoverImageFile}
                  variant="drawer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons - Sticky Bottom */}
        <ActionButtons
          onPublish={handlePublish}
          onSaveDraft={handleSaveDraft}
          isPublishing={isPublishing}
          isSaving={isSaving}
        />

        {/* AI Assistant Modal */}
        {showAIModal && (
          <AIAssistantModal
            onClose={() => setShowAIModal(false)}
            onInsert={(text) => {
              setEditorContent((prev) => prev + "\n" + text);
              setShowAIModal(false);
            }}
          />
        )}
      </div>
    </>
  );
}
