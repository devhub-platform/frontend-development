import React, { useState } from "react";
import { FileQuestion, HelpCircle, MessageSquare, X } from "lucide-react";

const HELP_CONTENT = {
  howToAsk: {
    title: "How to ask a good question",
    points: [
      "Start with a clear, specific title that describes the core problem.",
      "Explain what you are trying to achieve, not only the error message.",
      "List what you have already tried and why it did not work.",
      "Include minimal but complete code samples, logs, or screenshots.",
      "End with a clear question so others know exactly what you need.",
    ],
  },
  mrex: {
    title: "Minimal reproducible example",
    points: [
      "Remove any code that is not directly related to the problem.",
      "Use fake / test data if the real data is sensitive.",
      "Make sure someone else can copy-paste your code and see the same behaviour.",
      "Avoid huge files or entire projects; keep it to a few focused snippets.",
    ],
  },
  helpCenter: {
    title: "DevHub help center",
    points: [
      "Learn how voting, accepting answers, and reputation work on DevHub.",
      "Understand what types of questions are on-topic for the community.",
      "Read guidelines about tags, edits, and respectful communication.",
    ],
  },
  aboutSite: {
    title: "Questions about the site",
    points: [
      "Ask about how features work or suggest improvements for DevHub.",
      "Report bugs or unexpected behaviours in the platform.",
      "Discuss community rules, moderation, and long-term improvements.",
    ],
  },
};

export function AskSidebar() {
  const [activeHelp, setActiveHelp] = useState(null); // key from HELP_CONTENT
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const openHelp = (key) => {
    setActiveHelp(key);
    setIsHelpOpen(true);
  };

  const closeHelp = () => {
    setIsHelpOpen(false);
    setActiveHelp(null);
  };

  const activeData = activeHelp ? HELP_CONTENT[activeHelp] : null;

  return (
    <>
      <div className="space-y-6">
        {/* Draft help */}
        <div className="bg-white dark:bg-bg-secondary-dark rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-text-light flex items-center justify-center shrink-0">
              <FileQuestion className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Draft your question
              </h3>
            </div>
          </div>

          <SidebarStep
            number="1"
            title="Summarize the problem"
            text="Explain what you are trying to achieve, not only the error message."
          />
          <SidebarStep
            number="2"
            title="Describe what you've tried"
            text="Mention the approaches, docs, or tutorials you already followed."
          />
          <SidebarStep
            number="3"
            title="Show some code"
            text="Include the smallest code snippet that reproduces the issue."
          />
        </div>

        {/* Helpful links (محلّية كمودال) */}
        <div className="bg-white dark:bg-bg-secondary-dark rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-primary dark:text-text-dark" />
            <h3 className="font-medium text-gray-900 dark:text-white">
              Helpful guides
            </h3>
          </div>

          <HelpfulButton
            title="How to ask a good question"
            description="Step-by-step guide to writing clear, answerable programming questions."
            onClick={() => openHelp("howToAsk")}
          />
          <HelpfulButton
            title="Minimal reproducible example"
            description="How to reduce your code to the smallest version that shows the problem."
            onClick={() => openHelp("mrex")}
          />
          <HelpfulButton
            title="DevHub help center"
            description="Learn how DevHub works: voting, answers, tags, and more."
            onClick={() => openHelp("helpCenter")}
          />
          <HelpfulButton
            title="Ask about the site"
            description="Questions about the platform itself, features, and improvements."
            onClick={() => openHelp("aboutSite")}
          />
        </div>

        {/* Community tip */}
        <div className="bg-linear-to-br from-primary to-text-light rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-start gap-3 mb-2">
            <MessageSquare className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium mb-2">Community tip</h3>
              <p className="text-sm text-white/90">
                Questions that show research effort, include context, and have
                clear code samples tend to get better, faster answers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay modal */}
      {isHelpOpen && activeData && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          {/* خلفية معتمة */}
          <div className="absolute inset-0 bg-black/40" onClick={closeHelp} />
          {/* المودال */}
          <div className="relative z-50 max-w-lg w-[90%] sm:w-full bg-white dark:bg-bg-secondary-dark rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {activeData.title}
              </h2>
              <button
                type="button"
                onClick={closeHelp}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-bg-primary-dark text-gray-500 dark:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
              {activeData.points.map((p, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="mt-1 text-primary dark:text-text-dark">
                    •
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Tip: You can keep this guide open while writing your question.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SidebarStep({ number, title, text }) {
  return (
    <div className="flex gap-3 mb-4 last:mb-0">
      <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 dark:bg-text-dark/10 text-primary dark:text-text-dark flex items-center justify-center text-sm font-medium">
        {number}
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          {title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      </div>
    </div>
  );
}

function HelpfulButton({ title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left mb-3 last:mb-0 group"
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-text-light dark:text-text-dark group-hover:translate-x-0.5 transition-transform">
          →
        </span>
        <div>
          <p className="text-sm font-medium text-text-light dark:text-text-dark group-hover:underline">
            {title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
