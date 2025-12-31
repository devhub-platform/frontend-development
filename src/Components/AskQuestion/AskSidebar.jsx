import React from "react";
import { FileQuestion, HelpCircle, MessageSquare } from "lucide-react";

export function AskSidebar() {
  return (
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
          text="Include details about your goal and obstacles you're facing."
        />
        <SidebarStep
          number="2"
          title="Describe what you've tried"
          text="Show that you've made an effort to solve the problem yourself."
        />
        <SidebarStep
          number="3"
          title="Show some code"
          text="Include the minimum code necessary to reproduce your problem."
        />
      </div>

      {/* Helpful links */}
      <div className="bg-white dark:bg-bg-secondary-dark rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-primary dark:text-text-dark" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Helpful links
          </h3>
        </div>

        <SidebarLink>How to ask a good question</SidebarLink>
        <SidebarLink>How to create a minimal reproducible example</SidebarLink>
        <SidebarLink>Help center</SidebarLink>
        <SidebarLink>Ask about the site on meta</SidebarLink>
      </div>

      {/* Community tip */}
      <div className="bg-linear-to-br from-primary to-text-light rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-start gap-3 mb-2">
          <MessageSquare className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium mb-2">Community tip</h3>
            <p className="text-sm text-white/90">
              Questions that show research effort and provide context tend to
              get better, faster answers.
            </p>
          </div>
        </div>
      </div>
    </div>
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

function SidebarLink({ children }) {
  return (
    <a
      href="#"
      className="flex items-start gap-2 text-sm text-text-light dark:text-text-dark hover:underline mb-2 last:mb-0"
    >
      <span className="mt-0.5">→</span>
      <span>{children}</span>
    </a>
  );
}
