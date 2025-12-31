// src/Components/QAComponents/QuestionsList.jsx
import React from "react";
import { QuestionCard } from "./QuestionCard";

export function QuestionsList({ questions, dimFn }) {
  if (!questions || questions.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-600 dark:text-gray-300 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
        No questions found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          dimmed={dimFn ? dimFn(question) : false}
        />
      ))}
    </div>
  );
}
