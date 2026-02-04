// src/Pages/QA/QA.jsx
import React, { useMemo, useState } from "react";
import { QAHeader } from "../../Components/QAComponents/QAHeader";
import { QAToolbar } from "../../Components/QAComponents/QAToolbar";
import { FilterPanel } from "../../Components/QAComponents/FilterPanel";
import { QuestionsList } from "../../Components/QAComponents/QuestionsList";
import Sidebar from "../../Components/QAComponents/Sidebar";
import { mockQuestions } from "../../Components/QAComponents/mockQuestions";
import { SaveFilterModal } from "../../Components/QAComponents/SaveFilterModal";
import { Messages } from "../../Components/Messages/Messages";

export default function QA() {
  const [activeTab, setActiveTab] = useState("Newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [perPage, setPerPage] = useState(15);

  // من الفلتر
  const [noAnswersOnly, setNoAnswersOnly] = useState(false);
  const [unansweredOnly, setUnansweredOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Newest");
  const [filterTags, setFilterTags] = useState([]);

  // من الـ Sidebar
  const [watchedTags, setWatchedTags] = useState(["css", "json", "node.js"]);
  const [ignoredTags, setIgnoredTags] = useState(["php", "java"]);
  const [ignoreMode, setIgnoreMode] = useState("hide");
  const [savedFilters, setSavedFilters] = useState([]);

  // مودال حفظ الفلاتر
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState(null); // فلتر بنعدّله أو null

  const processedQuestions = useMemo(() => {
    let list = [...mockQuestions];

    if (activeTab === "Unanswered") {
      list = list.filter((q) => q.answers === 0);
    }

    if (noAnswersOnly || unansweredOnly) {
      list = list.filter((q) => q.answers === 0);
    }

    if (filterTags.length > 0) {
      const lower = filterTags.map((t) => t.toLowerCase());
      list = list.filter((q) =>
        q.tags.some((tag) => lower.includes(tag.toLowerCase()))
      );
    }

    if (sortBy === "Highest score") {
      list.sort((a, b) => b.votes - a.votes);
    } else if (sortBy === "Trending") {
      list.sort(
        (a, b) =>
          b.views +
          b.answers * 20 +
          b.votes * 10 -
          (a.views + a.answers * 20 + a.votes * 10)
      );
    }

    const ignoredSet = new Set(ignoredTags.map((t) => t.toLowerCase()));
    if (ignoreMode === "hide") {
      list = list.filter(
        (q) => !q.tags.some((t) => ignoredSet.has(t.toLowerCase()))
      );
    }

    return list.slice(0, perPage);
  }, [
    activeTab,
    noAnswersOnly,
    unansweredOnly,
    sortBy,
    filterTags,
    ignoredTags,
    ignoreMode,
    perPage,
  ]);

  const dimFn = (q) => {
    if (ignoreMode !== "gray") return false;
    const ignoredSet = new Set(ignoredTags.map((t) => t.toLowerCase()));
    return q.tags.some((t) => ignoredSet.has(t.toLowerCase()));
  };

  const totalCount = mockQuestions.length;

  const hotQuestions = [...mockQuestions]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // تطبيق فلتر محفوظ
  const applySavedFilter = (filter) => {
    const { tab, sort, tags, noAnswers, unanswered } = filter.criteria;
    setActiveTab(tab || "Newest");
    setSortBy(sort || "Newest");
    setFilterTags(tags || []);
    setNoAnswersOnly(!!noAnswers);
    setUnansweredOnly(!!unanswered);
  };

  // إضافة / تعديل فلتر (الاسم فقط)
  const upsertFilter = (title) => {
    if (editingFilter) {
      setSavedFilters((prev) =>
        prev.map((f) =>
          f.id === editingFilter.id ? { ...f, title } : f
        )
      );
    } else {
      const newFilter = {
        id: crypto.randomUUID(),
        title,
        criteria: {
          tab: activeTab,
          sort: sortBy,
          tags: filterTags,
          noAnswers: noAnswersOnly,
          unanswered: unansweredOnly,
        },
      };
      setSavedFilters((prev) => [newFilter, ...prev]);
    }
  };

  // فتح الفلتر بقيم فلتر محفوظ للتعديل
  const openFilterForEdit = (filter) => {
    const { tab, sort, tags, noAnswers, unanswered } = filter.criteria;

    setActiveTab(tab || "Newest");
    setSortBy(sort || "Newest");
    setFilterTags(tags || []);
    setNoAnswersOnly(!!noAnswers);
    setUnansweredOnly(!!unanswered);

    setFilterOpen(true); // يفتح لوحة الفلتر فوق
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-secondary-dark transition-colors">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:pt-3 pb-16">
        {/* زر عائم للموبايل / تابلت (أيقونة فقط) */}
                <div className="fixed bottom-4 right-4 z-50 lg:hidden">
                  <Messages />
                </div>
        
                {/* Sidebar لسطح المكتب – الكود الأصلي كما هو */}
                <div className="fixed bottom-0 left-2 z-50 w-[18%] mt-10 ml-2 hidden lg:block">
                  <Messages />
                </div>
        <QAHeader total={totalCount} />

        <div className="relative">
          <QAToolbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
          />

          {filterOpen && (
            <FilterPanel
              onClose={() => setFilterOpen(false)}
              values={{
                noAnswersOnly,
                unansweredOnly,
                sortBy,
                filterTags,
              }}
              onChange={({ noAnswers, unanswered, sort, tags }) => {
                setNoAnswersOnly(noAnswers);
                setUnansweredOnly(unanswered);
                setSortBy(sort);
                setFilterTags(tags);
              }}
              onSaveCustom={() => {
                setEditingFilter(null); // جديد
                setFilterModalOpen(true);
              }}
            />
          )}
        </div>

        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 lg:w-2/3">
            <QuestionsList questions={processedQuestions} dimFn={dimFn} />

            {/* Pagination */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Prev
                </button>
                <button className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Next
                </button>
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Per page:
                </span>
                {[15, 30, 50].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPerPage(num)}
                    className={`px-3 py-1 rounded-full transition-all ${
                      perPage === num
                        ? "bg-primary text-white"
                        : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-1/3">
            <Sidebar
              watchedTags={watchedTags}
              setWatchedTags={setWatchedTags}
              ignoredTags={ignoredTags}
              setIgnoredTags={setIgnoredTags}
              ignoreMode={ignoreMode}
              setIgnoreMode={setIgnoreMode}
              hotQuestions={hotQuestions}
              savedFilters={savedFilters}
              setSavedFilters={setSavedFilters}
              onApplySavedFilter={applySavedFilter}
              onEditFilter={(filter) => {
                setEditingFilter(filter);        // عشان لو هتعدّلي الاسم من المودال
                openFilterForEdit(filter);       // يفتح شاشة الفلتر بالقيم
              }}
              onCreateFilter={() => {
                setFilterOpen(true);             // زي زرار Filter فوق
              }}
            />
          </aside>
        </div>
      </main>

      <SaveFilterModal
        open={filterModalOpen}
        initialName={editingFilter?.title || ""}
        onClose={() => {
          setFilterModalOpen(false);
          setEditingFilter(null);
        }}
        onSave={(title) => {
          upsertFilter(title);
          setFilterModalOpen(false);
          setEditingFilter(null);
        }}
      />
    </div>
  );
}
