import { Upload, Wand2, Eye, EyeOff, FileText, Lightbulb } from "lucide-react";
import { useCallback } from "react";

export function RightSidebar({
  coverImage,
  onCoverImageChange,
  variant = "desktop",
}) {
  const handleImageUpload = useCallback(
    (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event?.target?.result;
        if (typeof result === "string") onCoverImageChange(result);
      };
      reader.readAsDataURL(file);
    },
    [onCoverImageChange],
  );

  const handleGenerateImage = async () => {
    alert(
      "AI Image generation would happen here. For demo purposes, using a placeholder.",
    );
    onCoverImageChange(
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
    );
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

          {coverImage ? (
            <div className="relative group">
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onCoverImageChange(null)}
                className="
                  absolute top-2 right-2 p-1 rounded
                  bg-red-600 text-white
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

              <button
                type="button"
                onClick={handleGenerateImage}
                className="
                  w-full px-4 py-2 rounded-lg transition-all duration-300
                  bg-primary text-white hover:shadow-xl hover:-translate-y-0.5
                  flex items-center justify-center gap-2 cursor-pointer font-semibold
                "
              >
                <Wand2 className="w-5 h-5" />
                Generate with AI
              </button>
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
