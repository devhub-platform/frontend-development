/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchQuestionsByTag } from "../../services/qaApi";
import { QuestionCard } from "../../Components/QAComponents/QuestionCard";
import { ArrowLeft, Tag } from "lucide-react";

export default function QuestionsByTag() {
  const { tagName } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getTaggedQuestions() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchQuestionsByTag(tagName);
        if (res?.success) {
          setQuestions(res.data || []);
        }
      } catch (err) {
        setError("Failed to load questions for this tag.");
      } finally {
        setLoading(false);
      }
    }
    getTaggedQuestions();
  }, [tagName]);

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-secondary-dark transition-colors">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link & Header */}
        <div className="mb-8">
          <Link
            to="/qa"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-text-dark hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Q&A
          </Link>

          <div className="flex items-center gap-3 bg-white dark:bg-bg-primary-dark p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-3 bg-primary/10 dark:bg-text-dark/10 rounded-xl text-primary dark:text-text-dark">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white capitalize">
                Questions tagged [{tagName}]
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Found {questions.length} questions mapped to this category
              </p>
            </div>
          </div>
        </div>

        {/* List of Filtered Questions */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200 text-sm">
            {error}
          </div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-600 dark:text-gray-300 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
            No questions found with #{tagName} tag yet.
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
