import React from "react";
import { CheckCheck, Trash2, Bell, Sparkles } from "lucide-react";

export function NotificationFeed({
  activeFilter,
  setActiveFilter,
  unreadCount,
  totalCount,
  filters,
  handleMarkAllAsRead,
  handleClearAll,
  children,
  loading,
  error,
}) {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full py-10 px-4 relative">
      {/* Background Decor */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-linear-to-b from-primary/10 to-transparent -z-10 blur-3xl" />

      <div className="bg-white/70 dark:bg-bg-secondary-dark/80 backdrop-blur-xl rounded-4xl shadow-2xl border border-white dark:border-white/5 overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-10 border-b border-slate-100 dark:border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-primary rounded-2xl text-white shadow-lg shadow-primary/30">
                  <Bell size={22} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Updates
                </h2>
              </div>
              <p className="text-slate-500 dark:text-neutral-400 flex items-center gap-2 font-medium ml-1">
                <Sparkles size={16} className="text-amber-500 animate-pulse" />
                <span>
                  You have{" "}
                  <b className="text-primary dark:text-text-dark">
                    {unreadCount} unread
                  </b>{" "}
                  messages
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0 || loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold transition-all hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100 active:scale-95"
              >
                <CheckCheck size={18} />
                <span className="hidden sm:inline">Mark as read</span>
              </button>
              <button
                onClick={handleClearAll}
                disabled={totalCount === 0 || loading}
                className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                title="Clear all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-8 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                  ${
                    activeFilter === filter.key
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-white/10"
                  }`}
              >
                {filter.label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeFilter === filter.key ? "bg-white/20" : "bg-slate-200 dark:bg-white/10"}`}
                >
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-2 min-h-100">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-400">
                Loading your feed...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="m-6 p-4 text-center text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200/50">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {children}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
