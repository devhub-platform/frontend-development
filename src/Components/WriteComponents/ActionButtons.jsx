import { Send, Save } from "lucide-react";

export function ActionButtons({
  onPublish,
  onSaveDraft,
  isPublishing,
  isSaving,
}) {
  return (
    <div className="sticky bottom-0 z-40 bg-white border-t border-gray-200 shadow-lg dark:bg-bg-primary-dark dark:border-gray-700 transition-colors">
      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-[#475569] dark:text-gray-400 text-sm order-2 sm:order-1">
            Auto-saved just now
          </div>

          <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
            <button
              onClick={onSaveDraft}
              disabled={isSaving}
              className="
                w-full sm:w-auto
                flex items-center justify-center gap-2
                px-4 sm:px-6 py-2.5 rounded-lg transition-colors
                border border-gray-300 text-[#0F172A] hover:bg-gray-50
                disabled:opacity-50 disabled:cursor-not-allowed
                dark:border-gray-700 dark:text-white dark:hover:bg-bg-secondary-dark
              "
              style={{ fontWeight: 600 }}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 text-text-light dark:text-text-dark" />
                  Save as Draft
                </>
              )}
            </button>

            <button
              onClick={onPublish}
              disabled={isPublishing}
              className="
                w-full sm:w-auto
                flex items-center justify-center gap-2
                px-4 sm:px-8 py-2.5 rounded-lg transition-all duration-300
                bg-primary text-white hover:shadow-xl hover:-translate-y-0.5
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              style={{ fontWeight: 600 }}
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Publish Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
