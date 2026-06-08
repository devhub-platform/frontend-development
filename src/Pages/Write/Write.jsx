/* eslint-disable no-unused-vars */
// src/pages/Write/Write.jsx
import { useEffect, useRef, useState } from "react";
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
  );

  const [coverImageFile, setCoverImageFile] = useState(null);
  const [generatedImageId, setGeneratedImageId] = useState(null);

  const [editorMode, setEditorMode] = useState("edit"); // 'edit' | 'preview'
  const [showAIModal, setShowAIModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mobile drawer
  const [showMobileSettings, setShowMobileSettings] = useState(false);

  // عدة صور جوه البوست (غير الـ cover)
  const [postImagePreviews, setPostImagePreviews] = useState([]); // array of dataURLs
  const [postImageFiles, setPostImageFiles] = useState([]); // array of File
  const dropZoneRef = useRef(null);

  // 🔴 الستيتس الخاصة بتكبير أي صورة في الصفحة
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);

  const handlePostImagesSelect = (filesList) => {
    const files = Array.from(filesList || []);
    if (!files.length) return;

    const newFiles = [...postImageFiles];
    const newPreviews = [...postImagePreviews];

    files.forEach((file) => {
      newFiles.push(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev?.target?.result;
        if (typeof result === "string") {
          newPreviews.push(result);
          setPostImagePreviews([...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setPostImageFiles(newFiles);
  };

  const handlePostImageInputChange = (e) => {
    handlePostImagesSelect(e.target.files);
    e.target.value = "";
  };

  const handleRemovePostImage = (index) => {
    setPostImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPostImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("ring-2", "ring-primary/60");
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("ring-2", "ring-primary/60");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("ring-2", "ring-primary/60");
    }
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handlePostImagesSelect(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  // Ctrl+V لصق صور من الـ clipboard
  const handlePasteImages = (e) => {
    if (!e.clipboardData || !e.clipboardData.items) return;
    const items = Array.from(e.clipboardData.items);
    const files = items
      .filter((it) => it.kind === "file" && it.type.startsWith("image/"))
      .map((it) => it.getAsFile())
      .filter(Boolean);
    if (files.length) {
      handlePostImagesSelect(files);
    }
  };

  useEffect(() => {
    window.addEventListener("paste", handlePasteImages);
    return () => {
      window.removeEventListener("paste", handlePasteImages);
    };
  });

  // Title textarea auto-resize بدل input
  const titleRef = useRef(null);
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [title]);

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

  const resetForm = () => {
    setTitle("");
    setSelectedTags([]);
    setEditorContent("");
    setCoverImagePreview(null);
    setCoverImageFile(null);
    setGeneratedImageId(null);
    setPostImageFiles([]);
    setPostImagePreviews([]);
  };

  const handlePublish = async () => {
    if (!validatePost()) return;

    try {
      setIsPublishing(true);

      const payload = {
        title: title.trim(),
        content: editorContent,
        status: "published",
        read_time: undefined,
        tags: selectedTags,
        coverImageFile: coverImageFile,
        imageFiles: postImageFiles,
        generated_image_id: generatedImageId,
      };

      const res = await createPost(payload);
      toast.success(res?.message || "Post published successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      const msg =
        err?.friendlyMessage || "Failed to publish post. Please try again.";
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
        coverImageFile: coverImageFile,
        imageFiles: postImageFiles,
        generated_image_id: generatedImageId,
      };

      const res = await createPost(payload);
      toast.success(res?.message || "Draft saved successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      const msg =
        err?.friendlyMessage || "Failed to save draft. Please try again.";
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
                  <textarea
                    ref={titleRef}
                    rows={1}
                    placeholder="New post title here..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="
                      w-full px-3 sm:px-4 py-3
                      text-3xl sm:text-2xl lg:text-3xl
                      border-none outline-none
                      bg-white text-black placeholder-gray-300
                      dark:bg-bg-primary-dark dark:text-white dark:placeholder-gray-500
                      transition-colors rounded-sm font-extrabold leading-[1.1]
                      resize-none overflow-hidden
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

                {/* Images inside the post */}
                <div className="mb-6">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#475569] dark:text-gray-300">
                    <ImageIcon className="w-4 h-4" />
                    Images inside the post (optional)
                  </h3>

                  <div
                    ref={dropZoneRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="
                      flex flex-col gap-2 p-4 rounded-lg border border-dashed border-gray-300
                      bg-white/70 dark:bg-bg-primary-dark/80 dark:border-gray-700
                      text-xs sm:text-sm text-[#64748b] dark:text-gray-300
                      cursor-pointer transition-colors
                      hover:border-primary hover:bg-slate-50 dark:hover:bg-bg-primary-dark
                    "
                    onClick={() =>
                      dropZoneRef.current
                        ?.querySelector("input[type=file]")
                        ?.click()
                    }
                  >
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span className="font-medium">
                        Drag & drop images here, click to browse, or paste with
                        Ctrl+V
                      </span>
                    </div>
                    <span>Supports multiple images (JPG, PNG, GIF...)</span>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePostImageInputChange}
                    />
                  </div>

                  {/* Thumbnails (🔴 تم إضافة onClick هنا لتكبير صور البوست عند الضغط عليها) */}
                  {postImagePreviews.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {postImagePreviews.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative w-28 h-20 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group bg-white dark:bg-bg-primary-dark"
                        >
                          <img
                            src={src}
                            alt={`Post ${idx + 1}`}
                            className="w-full h-full object-cover cursor-zoom-in"
                            onClick={() => setActiveLightboxImage(src)} // تفتح الكبيرة
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePostImage(idx);
                            }}
                            className="
                              absolute top-1 right-1 p-1 rounded-md
                              bg-black/60 text-white cursor-pointer
                              opacity-0 group-hover:opacity-100
                              transition-opacity z-10
                            "
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
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

            {/* Right Sidebar (Desktop) */}
            <div className="hidden lg:block">
              <RightSidebar
                coverImagePreview={coverImagePreview}
                onCoverImagePreviewChange={setCoverImagePreview}
                onCoverFileChange={setCoverImageFile}
                variant="desktop"
                generatedImageId={generatedImageId}
                onGeneratedImageIdChange={setGeneratedImageId}
                currentTitle={title}
                onPreviewLargeImage={setActiveLightboxImage} // 🔴 مررنا الـ handler لتكبير الكفر
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
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-bg-primary-dark transition-colors"
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
                  generatedImageId={generatedImageId}
                  onGeneratedImageIdChange={setGeneratedImageId}
                  currentTitle={title}
                  onPreviewLargeImage={setActiveLightboxImage} // 🔴 مررنا الـ handler للموبايل برضه
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
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
            onInsert={({ content, title: aiTitle }) => {
              if (aiTitle) setTitle(aiTitle);
              setEditorContent((prev) => prev + "\n" + content);
              setShowAIModal(false);
            }}
          />
        )}

        {/* 🔴 شاشة التكبير المنبثقة الـ Lightbox (المشتركة لكل صور الصفحة) */}
        {activeLightboxImage && (
          <div
            className="fixed inset-0 z-200 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
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
              alt="Large Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-transform duration-300 scale-100"
              onClick={(e) => e.stopPropagation()} // عشان ما يقفلش لما نضغط ع الصورة نفسها
            />
          </div>
        )}
      </div>
    </>
  );
}
