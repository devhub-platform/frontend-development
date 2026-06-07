/* eslint-disable no-unused-vars */
import { useState } from "react";
import { X, Wand2, Copy, RefreshCw, Check } from "lucide-react";
import { motion } from "motion/react";
import { generateAIContent } from "../../services/postsApi";
import toast from "react-hot-toast";

export function AIAssistantModal({ onClose, onInsert }) {
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedTitles, setGeneratedTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      setIsGenerating(true);
      setGeneratedContent("");
      setGeneratedTitles([]);

      const res = await generateAIContent({
        prompt: prompt.trim(),
        length: "short", // تقدري تغيريها أو تعملي لها State لو حابة الـ user يختار
        generate_title: true,
      });

      if (res?.success) {
        setGeneratedContent(res.content);
        setGeneratedTitles(res.titles || []);
        if (res.titles && res.titles.length > 0) {
          setSelectedTitle(res.titles[0]); // اختيار أول عنوان تلقائياً
        }
        toast.success("Content generated successfully!");
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (err) {
      const msg = err?.friendlyMessage || "Failed to generate content.";
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => handleGenerate();

  const handleCopy = async () => {
    if (!generatedContent) return;
    await navigator.clipboard.writeText(generatedContent);
    toast.success("Content copied to clipboard!");
  };

  const handleCopyTitle = async (titleText) => {
    await navigator.clipboard.writeText(titleText);
    toast.success("Title copied!");
  };

  // بنبعت الـ content والـ title المختار لصفحة الـ Write عشان تحط كل حاجة في مكانها
  const handleInsert = () => {
    onInsert({
      content: generatedContent,
      title: selectedTitle,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-full flex items-end sm:items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.stopPropagation()}
          className="
            w-full max-w-3xl
            bg-white dark:bg-bg-primary-dark dark:text-white
            rounded-2xl sm:rounded-xl
            shadow-2xl border border-gray-200 dark:border-gray-700
            overflow-hidden
            max-h-[92vh] sm:max-h-[85vh]
            flex flex-col
          "
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg dark:bg-bg-secondary-dark shrink-0">
                <Wand2 className="w-6 h-6 text-text-light dark:text-text-dark" />
              </div>

              <div className="min-w-0">
                <h2
                  className="text-xl sm:text-2xl text-[#0F172A] dark:text-white"
                  style={{ fontWeight: 800 }}
                >
                  AI Writing Assistant
                </h2>
                <p className="text-sm sm:text-base text-[#475569] dark:text-gray-400">
                  Generate content based on your prompt
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-bg-secondary-dark"
              title="Close"
            >
              <X className="w-6 h-6 text-[#475569] dark:text-gray-200" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mb-5 sm:mb-6">
              <label className="block mb-2 text-sm sm:text-base text-[#475569] dark:text-gray-300">
                What would you like to write about?
              </label>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Write an introduction about React hooks and their benefits..."
                className="
                  w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none
                  focus:border-primary transition-colors
                  bg-white text-[#0F172A]
                  dark:bg-bg-secondary-dark dark:text-white dark:border-gray-700
                "
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5 sm:mb-6">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="
                  w-full sm:w-auto
                  flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg
                  transition-all duration-300
                  bg-primary text-white hover:shadow-xl hover:-translate-y-0.5
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
                style={{ fontWeight: 600 }}
              >
                <Wand2 className="w-5 h-5" />
                {isGenerating ? "Generating..." : "Generate"}
              </button>

              {generatedContent && !isGenerating && (
                <button
                  type="button"
                  onClick={handleRegenerate}
                  className="
                    w-full sm:w-auto
                    flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg transition-colors
                    border border-gray-300 text-[#0F172A] hover:bg-gray-50
                    dark:border-gray-700 dark:text-white dark:hover:bg-bg-secondary-dark
                  "
                  style={{ fontWeight: 600 }}
                >
                  <RefreshCw className="w-5 h-5" />
                  Regenerate
                </button>
              )}
            </div>

            {isGenerating && (
              <div className="bg-gray-50 rounded-lg p-6 sm:p-8 text-center dark:bg-bg-secondary-dark">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-[#475569] dark:text-gray-400">
                  Generating content & titles...
                </p>
              </div>
            )}

            {generatedContent && !isGenerating && (
              <div className="space-y-6">
                {/* AI Titles Section */}
                {generatedTitles.length > 0 && (
                  <div className="bg-slate-50 dark:bg-bg-secondary-dark/50 p-4 rounded-xl border border-gray-150 dark:border-gray-700">
                    <h4 className="text-sm font-bold text-[#0F172A] dark:text-white mb-3">
                      Suggested Titles (Select one to insert):
                    </h4>
                    <div className="space-y-2">
                      {generatedTitles.map((t, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedTitle(t)}
                          className={`p-2.5 rounded-lg border text-sm cursor-pointer transition-all flex items-center justify-between ${
                            selectedTitle === t
                              ? "border-primary bg-primary/5 dark:bg-primary/10 text-primary dark:text-text-dark font-semibold"
                              : "border-gray-200 bg-white dark:bg-bg-primary-dark hover:border-gray-300 dark:border-gray-700"
                          }`}
                        >
                          <span>{t}</span>
                          {selectedTitle === t && (
                            <Check className="w-4 h-4 text-primary dark:text-text-dark shrink-0 ml-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Content View */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 dark:bg-bg-secondary-dark">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h3
                      className="text-[#0F172A] dark:text-white"
                      style={{ fontWeight: 800 }}
                    >
                      Generated Content
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="
                          w-full sm:w-auto
                          flex items-center justify-center gap-2 px-3 py-2 rounded transition-colors
                          text-[#475569] hover:bg-gray-200
                          dark:text-gray-200 dark:hover:bg-bg-primary-dark
                        "
                        style={{ fontWeight: 600 }}
                      >
                        <Copy className="w-4 h-4" />
                        Copy Code
                      </button>

                      <button
                        type="button"
                        onClick={handleInsert}
                        className="
                          w-full sm:w-auto
                          flex items-center justify-center gap-2 px-4 py-2 rounded transition-colors
                          bg-primary text-white hover:opacity-95
                        "
                        style={{ fontWeight: 600 }}
                      >
                        Insert into editor
                      </button>
                    </div>
                  </div>

                  {/* بما إن الكونتنت راجع Markdown أو نص من الـ API، بنعرضه داخل pre-wrap عشان يحافظ على التنسيق */}
                  <div className="prose max-w-none dark:prose-invert whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                    {generatedContent}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 sm:hidden border-t border-gray-200 dark:border-gray-700 text-center text-xs text-[#475569] dark:text-gray-400">
            Tap outside to close
          </div>
        </motion.div>
      </div>
    </div>
  );
}
