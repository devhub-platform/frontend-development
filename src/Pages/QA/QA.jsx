/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { QAHeader } from "../../Components/QAComponents/QAHeader";
import { QAToolbar } from "../../Components/QAComponents/QAToolbar";
import { QuestionsList } from "../../Components/QAComponents/QuestionsList";
import { Sidebar } from "../../Components/QAComponents/Sidebar";
import { Messages } from "../../Components/Messages/Messages";
import * as qaApi from "../../services/qaApi";

export default function QA() {
  const [questions, setQuestions] = useState([]);
  const [hotQuestions, setHotQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Newest");
  const [meta, setMeta] = useState({ total: 0, current_page: 1, last_page: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  // دالة تحميل الأسئلة
  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await qaApi.fetchQuestions({
        tab: activeTab,
        page: currentPage,
      });
      setQuestions(data.data || []);
      setMeta(data.meta || { total: 0, current_page: 1, last_page: 1 });
    } catch (err) {
      setError("Failed to load questions. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage]);

  // دالة تحميل الـ Sidebar Hot Questions
  const loadHotQuestions = useCallback(async () => {
    try {
      const data = await qaApi.fetchHotQuestions();
      setHotQuestions(data);
    } catch (err) {
      console.error("Hot questions error:", err);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    loadHotQuestions();
  }, [loadHotQuestions]);

  // دالة الانتقال لتاب الهوت من الـ Sidebar
  const handleViewMoreHot = () => {
    setActiveTab("Trending"); // دي اللي مرتبطة بـ sort_by=hot في الـ API
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" }); // حركة شيك تطلع المستخدم لأول النتائج
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-secondary-dark transition-colors">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:pt-3 pb-16">
        {/* Floating Messages */}
        <div className="fixed bottom-4 right-4 z-50 lg:hidden">
          {" "}
          <Messages />{" "}
        </div>
        <div className="fixed bottom-0 left-2 z-50 w-[18%] mt-10 ml-2 hidden lg:block">
          {" "}
          <Messages />{" "}
        </div>

        <QAHeader total={meta.total} />

        <QAToolbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setCurrentPage(1);
          }}
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 lg:w-2/3">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <QuestionsList questions={questions} />

                {/* Pagination */}
                {meta.last_page > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-500">
                      Page {meta.current_page} of {meta.last_page}
                    </div>
                    <div className="flex gap-2">
                      <button
                        disabled={meta.current_page === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className="px-5 py-2 rounded-full border border-gray-300 dark:border-gray-600 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        disabled={meta.current_page === meta.last_page}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="px-5 py-2 rounded-full bg-primary text-white disabled:opacity-30 hover:bg-opacity-90 transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-1/3">
            <Sidebar
              hotQuestions={hotQuestions}
              onViewMoreHot={handleViewMoreHot}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
