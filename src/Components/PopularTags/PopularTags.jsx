import React, { useEffect, useState } from "react";
import { Tags } from "lucide-react";
import axiosInstance from "../../config/api";

export function PopularTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const { data } = await axiosInstance.get("/trending/tags", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setTags(data.data || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  return (
    <div className="bg-white rounded-md p-5 border border-gray-200 shadow-sm mb-5 dark:bg-bg-secondary-dark dark:border-gray-900 dark:shadow-gray-700/30">
      <div className="flex items-center gap-2 mb-4">
        <Tags className="w-4 h-4 text-text-light dark:text-text-dark" />
        <h2 className="text-gray-900 dark:text-white">Popular Tags</h2>
      </div>

      <div className="flex flex-col gap-1">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 px-3 animate-pulse"
              >
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-10" />
              </div>
            ))
          : tags.map((tag) => (
              <a
                key={tag.id}
                href="#"
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors group dark:hover:bg-bg-primary-dark"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 transition-colors dark:text-gray-300">
                    #{tag.name}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">
                  {tag.count?.toLocaleString()}
                </span>
              </a>
            ))}
      </div>
    </div>
  );
}
