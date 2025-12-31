// src/Pages/AskQuestion/AskQuestionPage.jsx
import { QuestionForm } from "../../Components/AskQuestion/QuestionForm";
import { AskSidebar } from "../../Components/AskQuestion/AskSidebar";

export default function AskQuestionPage() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-secondary-dark transition-colors">
      <main className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Hero */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Ask a question
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl">
            Fill in each step to describe your problem clearly so other
            developers can help you faster.
          </p>
        </header>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_320px] gap-8 lg:gap-10">
          <QuestionForm />
          <AskSidebar />
        </div>
      </main>
    </div>
  );
}
