import { Upload, Wand2, Eye, EyeOff, FileText, Lightbulb } from "lucide-react";
import { useCallback } from "react";

export function RightSidebar({
  coverImage,
  onCoverImageChange,
  visibility,
  onVisibilityChange,
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
    [onCoverImageChange]
  );

  const handleGenerateImage = async () => {
    alert(
      "AI Image generation would happen here. For demo purposes, using a placeholder."
    );
    onCoverImageChange(
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop"
    );
  };

  const options = [
    { value: "public", label: "Public", icon: Eye, desc: "Anyone can see" },
    {
      value: "private",
      label: "Private",
      icon: EyeOff,
      desc: "Only you can see",
    },
    { value: "draft", label: "Draft", icon: FileText, desc: "Save for later" },
  ];

  return (
    <aside
      className={`
    ${
      variant === "desktop"
        ? "w-80 p-6 min-h-screen sticky top-0"
        : "w-full p-0"
    }
    bg-white text-[#0F172A] border-l border-gray-200
    dark:bg-bg-secondary-dark dark:text-white dark:border-gray-700
    transition-colors
  `}
    >
      <div className="space-y-6">
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
                  flex items-center justify-center gap-2
                "
                style={{ fontWeight: 600 }}
              >
                <Wand2 className="w-5 h-5" />
                Generate with AI
              </button>
            </div>
          )}
        </div>

        {/* Post Visibility Section */}
        <div className="rounded-lg p-4 shadow-lg bg-white border border-gray-200 dark:bg-bg-primary-dark dark:border-gray-700">
          <h3
            className="mb-3 flex items-center gap-2 text-text-light dark:text-text-dark"
            style={{ fontWeight: 800 }}
          >
            <Eye className="w-5 h-5" />
            Post Visibility
          </h3>

          <div className="grid gap-3">
            {options.map((option) => {
              const Icon = option.icon;
              const active = visibility === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onVisibilityChange(option.value)}
                  className={`
            w-full text-left rounded-xl border p-4 transition-all duration-200
            ${
              active
                ? "border-primary bg-[rgba(0,56,144,0.08)] dark:bg-[rgba(81,162,255,0.12)]"
                : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-bg-secondary-dark dark:hover:bg-bg-primary-dark"
            }
          `}
                >
                  {/* keep real input for accessibility */}
                  <input
                    type="radio"
                    name="visibility"
                    value={option.value}
                    checked={active}
                    onChange={() => onVisibilityChange(option.value)}
                    className="sr-only"
                  />

                  <div className="flex items-start gap-3">
                    <div
                      className={`
                mt-0.5 p-2 rounded-lg
                ${
                  active
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-[#0F172A] dark:bg-bg-primary-dark dark:text-white"
                }
              `}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div
                          className="text-[#0F172A] dark:text-white"
                          style={{ fontWeight: 800 }}
                        >
                          {option.label}
                        </div>

                        {/* check badge */}
                        <div
                          className={`
                    h-6 w-6 rounded-full grid place-items-center border transition-colors
                    ${
                      active
                        ? "border-primary bg-primary text-white"
                        : "border-gray-200 bg-white text-transparent dark:border-gray-700 dark:bg-bg-primary-dark"
                    }
                  `}
                          aria-hidden="true"
                        >
                          ✓
                        </div>
                      </div>

                      <p className="mt-1 text-sm text-[#475569] dark:text-gray-400">
                        {option.desc}
                      </p>

                      {/* subtle hint */}
                      {active && (
                        <p className="mt-2 text-xs text-[#475569] dark:text-gray-300">
                          Selected visibility
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
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
