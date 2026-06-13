import React, { useState } from "react";
import { MessageSquarePlus, Search } from "lucide-react";
import { Link } from "react-router-dom";

export function QAHeader({ total, onSearchSubmit }) {
  const [localQuery, setLocalQuery] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(localQuery); // إرسال كلمة البحث لصفحة الـ QA الرئيسية لتفعيل الفلترة الحية
    }
  };

  return (
    <header className="mb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            Questions
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {total.toLocaleString()} questions • Latest from the DevHub
            community
          </p>
        </div>

        {/* 🔴 إضافة الـ Search Bar المطور والجميل جداً في المنتصف/اليمين متناسق وريسبونسيف بالكامل */}
        <form
          onSubmit={handleFormSubmit}
          className="w-full md:max-w-xs relative flex items-center"
        >
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search questions (e.g. laravel)..."
            className="w-full bg-white dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-full pl-4 pr-10 py-2.5 text-sm outline-none focus:border-primary transition-colors text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="absolute right-3 text-gray-400 hover:text-primary transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        <Link to="/ask" className="self-stretch sm:self-auto">
          <button className="w-full sm:w-auto justify-center group px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-primary text-white hover:bg-text-light transition-all shadow-md shadow-primary/30 hover:shadow-primary/50 flex items-center gap-2 text-sm sm:text-base font-bold cursor-pointer">
            <MessageSquarePlus className="w-5 h-5" />
            Ask Question
          </button>
        </Link>
      </div>
    </header>
  );
}
