import React, { useEffect, useState } from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import { getMyFollowedTopics } from "../services/LandingApi"; // 🔴 سحب الدالة الجاهزة من ملف السيرفيس الموحد

export function RecommendedTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        // نداء الدالة الجاهزة الحالية المتصححة
        const res = await getMyFollowedTopics();
        setTopics((res.data || []).slice(0, 5));
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div className="bg-white rounded-md p-5 border border-gray-200 shadow-sm mb-5 dark:bg-bg-secondary-dark dark:border-gray-900 dark:shadow-gray-700/30">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4 text-text-light dark:text-text-dark" />

        <h2 className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-wide">
          My Followed Topics
        </h2>
      </div>

      <div className="flex flex-col gap-1">
        {loading ? (
          <div className="flex justify-center items-center py-5 gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span className="text-xs text-gray-500">Loading topics...</span>
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center text-xs text-gray-400 py-3">
            No topics followed yet
          </div>
        ) : (
          topics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-bg-primary-dark transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>{topic.icon || "✨"}</span>

                <span className="text-gray-700 dark:text-gray-300 text-sm font-bold">
                  {topic.name}
                </span>
              </div>

              <span className="text-[10px] px-2 py-1 rounded-md bg-slate-100 dark:bg-gray-800 text-gray-400">
                #{topic.display_order}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
