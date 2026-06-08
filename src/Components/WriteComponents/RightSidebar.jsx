// src/Components/WriteComponents/RightSidebar.jsx
import {
  Upload,
  Wand2,
  EyeOff,
  Lightbulb,
  Loader2,
  Maximize2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { generateAIImage, deleteAIImage } from "../../services/postsApi";
import toast from "react-hot-toast";

export function RightSidebar({
  coverImagePreview,
  onCoverImagePreviewChange,
  onCoverFileChange,
  variant = "desktop",
  generatedImageId,
  onGeneratedImageIdChange,
  currentTitle = "",
  onPreviewLargeImage, // 🔴 بروب جديد استلمناه لتشغيل شاشة التكبير عند الضغط على الكفر
}) {
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showPromptInput, setShowPromptInput] = useState(false);

  const handleImageUpload = useCallback(
    (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (generatedImageId) {
        onGeneratedImageIdChange(null);
      }

      onCoverFileChange(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event?.target?.result;
        if (typeof result === "string") onCoverImagePreviewChange(result);
      };
      reader.readAsDataURL(file);
    },
    [
      onCoverFileChange,
      onCoverImagePreviewChange,
      generatedImageId,
      onGeneratedImageIdChange,
    ],
  );

  const handleGenerateImageSubmit = async () => {
    const finalPrompt =
      aiPrompt.trim() ||
      currentTitle.trim() ||
      "A futuristic developer workspace with code on screens";

    try {
      setIsGeneratingImg(true);
      const res = await generateAIImage(finalPrompt);

      if (res?.success) {
        onCoverImagePreviewChange(res.secure_url);
        onGeneratedImageIdChange(res.generated_image_id);
        onCoverFileChange(null);
        setShowPromptInput(false);
        toast.success(res.message || "AI Image generated successfully! 🎨");
      }
    } catch (err) {
      const msg = err?.friendlyMessage || "Failed to generate AI Image.";
      toast.error(msg);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleRemoveImage = async (e) => {
    e.stopPropagation(); // يمنع فتح الـ Preview لما نضغط حذف
    if (generatedImageId) {
      const loadingToast = toast.loading("Discarding AI Image from server...");
      try {
        const res = await deleteAIImage(generatedImageId);
        if (res?.success) {
          toast.success(res.message || "Generated image discarded.", {
            id: loadingToast,
          });
        }
      } catch (err) {
        toast.error(err?.friendlyMessage || "Failed to delete from server.", {
          id: loadingToast,
        });
      }
    }

    onCoverImagePreviewChange(null);
    onCoverFileChange(null);
    onGeneratedImageIdChange(null);
  };

  return (
    <aside
      className={`
    ${
      variant === "desktop"
        ? "w-80 p-6 min-h-screen sticky top-0"
        : "w-full p-0"
    }
    bg-slate-50 text-[#0F172A] lg:border-l border-gray-200 dark:border-gray-700
    dark:bg-bg-secondary-dark dark:text-white
    transition-colors
  `}
    >
      <div className="flex flex-col justify-center h-full overflow-hidden gap-6 pt-6">
        {/* Cover Image Section */}
        <div className="rounded-lg p-4 shadow-lg bg-white border border-gray-200 dark:bg-bg-primary-dark dark:border-gray-700">
          <h3
            className="mb-3 flex items-center gap-2 text-text-light dark:text-text-dark"
            style={{ fontWeight: 800 }}
          >
            <Upload className="w-5 h-5" />
            Cover Image
          </h3>

          {coverImagePreview ? (
            /* 🔴 جعلنا الحاوية قابلة للضغط لتفتح نافذة التكبير الكبيرة مع تغيير الماوس لـ zoom-in */
            <div
              className="relative group cursor-zoom-in"
              onClick={() => onPreviewLargeImage(coverImagePreview)}
            >
              <img
                src={coverImagePreview}
                alt="Cover"
                className="w-full h-32 object-cover rounded-lg"
              />
              {/* أيقونة تلميح للتكبير تظهر عند الـ Hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <Maximize2 className="w-6 h-6 text-white bg-black/40 p-1.5 rounded-full" />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="
                  absolute top-2 right-2 p-1 rounded z-10
                  bg-red-600 text-white cursor-pointer
                  opacity-0 group-hover:opacity-100 transition-opacity
                "
                title="Remove image"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <label
                className="
                  block w-full px-4 py-2 rounded-lg cursor-pointer transition-colors text-center
                  bg-gray-100 text-[#0F172A] border border-gray-200 hover:bg-gray-50
                  dark:bg-bg-secondary-dark dark:text-white dark:border-gray-700 dark:hover:bg-bg-primary-dark
                "
                style={{ fontWeight: 600 }}
              >
                <Upload className="w-5 h-5 inline mr-2" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {showPromptInput ? (
                <div className="space-y-2 mt-2 border-t pt-2 dark:border-gray-700">
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Enter image description (or leave empty to use title)..."
                    className="w-full text-xs p-2 border rounded dark:bg-bg-secondary-dark dark:text-white dark:border-gray-700 outline-none resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={isGeneratingImg}
                      onClick={handleGenerateImageSubmit}
                      className="flex-1 text-xs bg-primary text-white py-1.5 rounded font-semibold flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      {isGeneratingImg ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Generate"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPromptInput(false)}
                      className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white px-2 py-1.5 rounded font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPromptInput(true)}
                  disabled={isGeneratingImg}
                  className="
                    w-full px-4 py-2 rounded-lg transition-all duration-300
                    bg-primary text-white hover:shadow-xl hover:-translate-y-0.5
                    flex items-center justify-center gap-2 cursor-pointer font-semibold
                  "
                >
                  <Wand2 className="w-5 h-5" />
                  Generate with AI
                </button>
              )}
            </div>
          )}
        </div>

        {/* Helpful Tips */}
        <div className="rounded-lg p-4 shadow-lg bg-white border border-gray-200 dark:bg-bg-primary-dark dark:border-gray-700">
          <h3
            className="mb-3 flex items-center gap-2 text-text-light dark:text-text-dark"
            style={{ fontWeight: 800 }}
          >
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Writing Tips
          </h3>

          <ul className="text-[#475569] dark:text-gray-400 text-sm space-y-2">
            {[
              "Use clear, descriptive titles",
              "Add relevant tags for discoverability",
              "Include code examples when applicable",
              "Break up text with headers and lists",
              "Preview before publishing",
            ].map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="text-text-light dark:text-text-dark">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
