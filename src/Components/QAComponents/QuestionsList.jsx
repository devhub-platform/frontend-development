// src/Components/QAComponents/QuestionsList.jsx
import React from "react";
import { QuestionCard } from "./QuestionCard";

export function QuestionsList({ questions }) {
  if (!questions || questions.length === 0) {
    return (
      <div className="p-12 text-center text-sm text-gray-600 dark:text-gray-300 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
        No questions found for this filter.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
}
