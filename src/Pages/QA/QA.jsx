/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { QAHeader } from "../../Components/QAComponents/QAHeader";
import { QAToolbar } from "../../Components/QAComponents/QAToolbar";
import { QuestionsList } from "../../Components/QAComponents/QuestionsList";
import { Sidebar } from "../../Components/QAComponents/Sidebar";
import { Messages } from "../../Components/Messages/Messages";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import * as qaApi from "../../services/qaApi";

export default function QA() {
  const [questions, setQuestions] = useState([]);
  const [hotQuestions, setHotQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Newest");
  const [meta, setMeta] = useState({ total: 0, current_page: 1, last_page: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  // 🔴 ستيت لحمل كلمة البحث الحالية
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const PER_PAGE = 5;

  // دالة تحميل الأسئلة (سواء فلترة عادية أو سيرس)
  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 🔴 تكتيك ذكي: لو اليوزر بيبحث عن كلمة بنشغل الـ searchQuestions API
      if (searchQuery.trim()) {
        const data = await qaApi.searchQuestions(searchQuery.trim());
        setQuestions(data.data || []);
        setMeta(
          data.meta || {
            total: (data.data || []).length,
            current_page: 1,
            last_page: 1,
          },
        );
        setIsSearching(true);
      } else {
        // الفلترة والتابات العادية
        const data = await qaApi.fetchQuestions({
          tab: activeTab,
          page: currentPage,
          per_page: PER_PAGE,
        });
        setQuestions(data.data || []);
        setMeta(data.meta || { total: 0, current_page: 1, last_page: 1 });
        setIsSearching(false);
      }
    } catch (err) {
      setError("Failed to load questions. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, searchQuery]);

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewMoreHot = () => {
    setActiveTab("Trending");
    setCurrentPage(1);
    setSearchQuery(""); // تصفير السيرش عند الذهاب للهوت
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔴 دالة تصفير محرك البحث للعودة للوضع الطبيعي للمنصة
  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    setActiveTab("Newest");
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= meta.last_page; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${
            meta.current_page === i
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-secondary-dark transition-colors">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Floating Messages */}
        <div className="fixed bottom-4 right-4 z-50 lg:hidden">
          <Messages />
        </div>
        <div className="fixed bottom-0 left-2 z-50 w-[18%] mt-10 ml-2 hidden lg:block">
          <Messages />
        </div>

        {/* 🔴 تمرير هاندلر السيرش للهيدر ليلقط داتا الـ Input */}
        <QAHeader
          total={meta.total}
          onSearchSubmit={(query) => {
            setSearchQuery(query);
            setCurrentPage(1); // تصفير الصفحة للرقم 1 عند البحث
          }}
        />

        {/* إظهار بار تصفير البحث لو شغالين في حالة السيرش حالياً */}
        {isSearching ? (
          <div className="mb-6 p-4 bg-primary/5 dark:bg-text-dark/5 border border-primary/20 dark:border-text-dark/20 rounded-2xl flex items-center justify-between gap-4 animate-fadeIn">
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Filtered results for search query:{" "}
              <span className="text-primary dark:text-text-dark italic">
                "{searchQuery}"
              </span>
            </p>
            <button
              onClick={handleClearSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-black uppercase text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Search
            </button>
          </div>
        ) : (
          /* التولبار يظهر فقط في حالة العرض العادي وليس السيرش */
          <QAToolbar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
          />
        )}

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

                {/* جزء الـ Pagination المطور والمربوط بالكامل بالسيرفر */}
                {meta.last_page > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Showing {questions.length} of {meta.total} questions (Page{" "}
                      {meta.current_page} of {meta.last_page})
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        disabled={meta.current_page === 1}
                        onClick={() => handlePageChange(meta.current_page - 1)}
                        className="p-2 rounded-full border border-gray-300 dark:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center cursor-pointer"
                        title="Previous Page"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        {renderPageNumbers()}
                      </div>

                      <button
                        disabled={meta.current_page === meta.last_page}
                        onClick={() => handlePageChange(meta.current_page + 1)}
                        className="p-2 rounded-full border border-gray-300 dark:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center cursor-pointer"
                        title="Next Page"
                      >
                        <ChevronRight className="w-5 h-5" />
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
