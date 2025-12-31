// src/Components/AskQuestion/WhereToPost.jsx
import React from "react";
import { Check } from "lucide-react";

export function WhereToPost({ value, onChange }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
        Where should this question be posted?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <OptionCard
          active={value === "staging"}
          onClick={() => onChange("staging")}
          title="Staging Ground (private)"
          bulletColor="text-emerald-500"
          subtitle="Best for first‑time / draft questions."
          bullets={[
            "Get feedback before going public",
            "Improve wording and formatting",
            "Reviewed by experienced users",
          ]}
        />

        <OptionCard
          active={value === "public"}
          onClick={() => onChange("public")}
          title="DevHub public feed"
          bulletColor="text-sky-500"
          subtitle="Best for polished, researched questions."
          bullets={[
            "Visible to the whole community",
            "Faster answers from many users",
            "Can be edited after posting",
          ]}
        />
      </div>
    </div>
  );
}

function OptionCard({
  active,
  onClick,
  title,
  subtitle,
  bullets,
  bulletColor,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-lg border px-4 py-3 transition-all ${
        active
          ? "border-primary bg-primary/5 dark:border-text-dark dark:bg-text-dark/10 shadow-sm"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
            active
              ? "border-primary bg-primary dark:border-text-dark dark:bg-text-dark"
              : "border-gray-300 dark:border-gray-600"
          }`}
        >
          {active && <Check className="w-3 h-3 text-white" />}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {subtitle}
            </p>
          )}
          <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className={`${bulletColor} mt-0.5`}>•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  );
}
